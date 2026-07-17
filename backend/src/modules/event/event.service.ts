import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '../../libs/prisma';
import { v4 as uuidv4 } from 'uuid';
import { generatePin } from '@common/pin';
import { PublishEventDto } from './dto/publish-event.dto';

@Injectable()
export class EventService {
  getActive() {
    return prisma.event.findFirst({ where: { isActive: true } });
  }

  async getActiveId(): Promise<string | null> {
    const event = await prisma.event.findFirst({
      where: { isActive: true },
      select: { id: true },
    });
    return event?.id ?? null;
  }

  async findPast() {
    const events = await prisma.event.findMany({
      where: { isActive: false },
      orderBy: { createdAt: 'desc' },
    });
    return Promise.all(events.map((e) => this.withStats(e)));
  }

  async findOne(id: string) {
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    return this.withStats(event);
  }

  async getActiveWithStats() {
    const event = await this.getActive();
    if (!event) return null;
    return this.withStats(event);
  }

  async publish(dto: PublishEventDto) {
    return prisma.$transaction(async (tx) => {
      await tx.event.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });

      const event = await tx.event.create({
        data: {
          id: uuidv4(),
          pin: generatePin(),
          name: dto.name ?? null,
          isActive: true,
          presetMenuId: dto.presetMenuId ?? null,
        },
      });

      await tx.table.updateMany({
        where: { isStaging: true },
        data: { isStaging: false, eventId: event.id },
      });

      return event;
    });
  }

  async assignPreset(id: string, presetMenuId: string | null) {
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    return prisma.event.update({
      where: { id },
      data: { presetMenuId },
    });
  }

  private async withStats(event: {
    id: string;
    pin: string;
    name: string | null;
    isActive: boolean;
    presetMenuId: string | null;
    createdAt: Date;
  }) {
    const [tables, people, orders] = await Promise.all([
      prisma.table.findMany({
        where: { eventId: event.id },
        select: { id: true, _count: { select: { people: true } } },
      }),
      prisma.people.count({ where: { eventId: event.id } }),
      prisma.order.count({ where: { eventId: event.id } }),
    ]);

    return {
      ...event,
      stats: {
        tables: tables.length,
        occupied: tables.filter((t) => t._count.people > 0).length,
        people,
        orders,
      },
    };
  }
}
