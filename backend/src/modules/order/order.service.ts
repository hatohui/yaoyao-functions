import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '../../libs/prisma';
import { v4 as uuidv4 } from 'uuid';
import { CreateOrderDto } from './dto/create-order.dto';
import { BatchCreateOrderDto } from './dto/batch-create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

const orderIncludeWithLang = (lang: string) => ({
  variant: {
    include: {
      food: { include: { translations: { where: { language: lang } } } },
      translations: { where: { language: lang } },
    },
  },
  splits: true,
});

type OrderWithLangInclude = Awaited<
  ReturnType<typeof prisma.order.findMany<{ include: ReturnType<typeof orderIncludeWithLang> }>>
>[number];

@Injectable()
export class OrderService {
  private toResponseDto(order: OrderWithLangInclude) {
    return {
      id: order.id,
      tableId: order.tableId,
      variantId: order.variantId,
      eventId: order.eventId,
      quantity: order.quantity,
      price: Number(order.price),
      splitAll: order.splitAll,
      foodName: order.variant.food.translations[0]?.name ?? '',
      variantLabel: order.variant.translations[0]?.label ?? '',
      splits: order.splits.map((s) => ({ personId: s.personId })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  async findByTable(tableId: string, lang = 'en') {
    const orders = await prisma.order.findMany({
      where: { tableId },
      include: orderIncludeWithLang(lang),
      orderBy: { createdAt: 'desc' },
    });
    return orders.map((o) => this.toResponseDto(o));
  }

  async findAll(lang = 'en') {
    const orders = await prisma.order.findMany({
      include: orderIncludeWithLang(lang),
      orderBy: { createdAt: 'desc' },
    });
    return orders.map((o) => this.toResponseDto(o));
  }

  private async resolvePrice(variantId: string): Promise<number> {
    const variant = await prisma.foodVariant.findUnique({
      where: { id: variantId },
      select: { price: true },
    });
    if (!variant) throw new NotFoundException('Food variant not found');
    return variant.price ? Number(variant.price) : 0;
  }

  private async tableEventId(tableId: string): Promise<string | null> {
    const table = await prisma.table.findUnique({
      where: { id: tableId },
      select: { eventId: true },
    });
    if (!table) throw new NotFoundException('Table not found');
    return table.eventId;
  }

  private splitData(splitAll: boolean, personIds?: string[]) {
    if (splitAll || !personIds || personIds.length === 0) return undefined;
    return { create: personIds.map((personId) => ({ personId })) };
  }

  async create(dto: CreateOrderDto, lang = 'en') {
    const [price, eventId] = await Promise.all([
      this.resolvePrice(dto.variantId),
      this.tableEventId(dto.tableId),
    ]);
    const splitAll = dto.splitAll ?? true;
    const order = await prisma.order.create({
      data: {
        id: uuidv4(),
        tableId: dto.tableId,
        variantId: dto.variantId,
        eventId,
        quantity: dto.quantity ?? 1,
        price,
        splitAll,
        splits: this.splitData(splitAll, dto.personIds),
      },
      include: orderIncludeWithLang(lang),
    });
    return this.toResponseDto(order);
  }

  async createBatch(dto: BatchCreateOrderDto, lang = 'en') {
    const eventId = await this.tableEventId(dto.tableId);
    const splitAll = dto.splitAll ?? true;
    const priced = await Promise.all(
      dto.items.map(async (item) => ({
        item,
        price: await this.resolvePrice(item.variantId),
      })),
    );

    const orders = await prisma.$transaction((tx) =>
      Promise.all(
        priced.map(({ item, price }) =>
          tx.order.create({
            data: {
              id: uuidv4(),
              tableId: dto.tableId,
              variantId: item.variantId,
              eventId,
              quantity: item.quantity ?? 1,
              price,
              splitAll,
              splits: this.splitData(splitAll, dto.personIds),
            },
            include: orderIncludeWithLang(lang),
          }),
        ),
      ),
    );
    return orders.map((o) => this.toResponseDto(o));
  }

  async update(id: string, dto: UpdateOrderDto, lang = 'en') {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    const splitAll = dto.splitAll ?? order.splitAll;
    const resetSplits =
      dto.splitAll !== undefined || dto.personIds !== undefined;

    const updated = await prisma.$transaction(async (tx) => {
      if (resetSplits) {
        await tx.orderSplit.deleteMany({ where: { orderId: id } });
        if (!splitAll && dto.personIds && dto.personIds.length > 0) {
          await tx.orderSplit.createMany({
            data: dto.personIds.map((personId) => ({ orderId: id, personId })),
          });
        }
      }
      return tx.order.update({
        where: { id },
        data: {
          quantity: dto.quantity ?? order.quantity,
          splitAll,
        },
        include: orderIncludeWithLang(lang),
      });
    });
    return this.toResponseDto(updated);
  }

  async remove(id: string) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    await prisma.order.delete({ where: { id } });
    return { id };
  }
}
