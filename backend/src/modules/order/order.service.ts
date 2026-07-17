import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '../../libs/prisma';
import { v4 as uuidv4 } from 'uuid';
import { CreateOrderDto } from './dto/create-order.dto';
import { BatchCreateOrderDto } from './dto/batch-create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

const orderInclude = {
  variant: { include: { food: true } },
  splits: true,
};

@Injectable()
export class OrderService {
  findByTable(tableId: string) {
    return prisma.order.findMany({
      where: { tableId },
      include: orderInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  findAll() {
    return prisma.order.findMany({
      include: orderInclude,
      orderBy: { createdAt: 'desc' },
    });
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

  async create(dto: CreateOrderDto) {
    const [price, eventId] = await Promise.all([
      this.resolvePrice(dto.variantId),
      this.tableEventId(dto.tableId),
    ]);
    const splitAll = dto.splitAll ?? true;
    return prisma.order.create({
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
      include: orderInclude,
    });
  }

  async createBatch(dto: BatchCreateOrderDto) {
    const eventId = await this.tableEventId(dto.tableId);
    const splitAll = dto.splitAll ?? true;
    const priced = await Promise.all(
      dto.items.map(async (item) => ({
        item,
        price: await this.resolvePrice(item.variantId),
      })),
    );

    return prisma.$transaction((tx) =>
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
            include: orderInclude,
          }),
        ),
      ),
    );
  }

  async update(id: string, dto: UpdateOrderDto) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    const splitAll = dto.splitAll ?? order.splitAll;
    const resetSplits =
      dto.splitAll !== undefined || dto.personIds !== undefined;

    return prisma.$transaction(async (tx) => {
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
        include: orderInclude,
      });
    });
  }

  async remove(id: string) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    await prisma.order.delete({ where: { id } });
    return { id };
  }
}
