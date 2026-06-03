import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { prisma } from "../../libs/prisma";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class OrderService {
  findByTable(tableId: string) {
    return prisma.order.findMany({
      where: { tableId },
      include: { variant: { include: { food: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  findAll() {
    return prisma.order.findMany({
      include: { variant: { include: { food: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  create(dto: CreateOrderDto) {
    return prisma.order.create({
      data: {
        id: uuidv4(),
        tableId: dto.tableId,
        variantId: dto.variantId,
        quantity: dto.quantity,
        price: dto.price,
        orderedBy: dto.orderedBy,
      },
    });
  }

  async remove(id: string) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException("Order not found");
    await prisma.order.delete({ where: { id } });
  }
}
