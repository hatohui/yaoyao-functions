import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { prisma } from '../../libs/prisma';
import { v4 as uuidv4 } from 'uuid';
import { EventService } from '@modules/event/event.service';
import { ConfigService } from '@modules/config/config.service';
import { CONFIG_KEYS } from '@common/config/registry';
import { CreateTableDto } from './dto/create-table.dto';
import { BulkCreateTableDto } from './dto/bulk-create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

type TableRow = {
  id: string;
  name: string;
  capacity: number;
  isStaging: boolean;
  no: number;
  x: number | null;
  y: number | null;
  tableLeaderId: string | null;
  eventId: string | null;
  _count: { people: number };
};

@Injectable()
export class TableService {
  constructor(
    private events: EventService,
    private config: ConfigService,
  ) {}

  private toDto(t: TableRow) {
    const { _count, ...rest } = t;
    return { ...rest, seated: _count.people };
  }

  async findForActiveEvent(page = 1, count = 20, search?: string) {
    const eventId = await this.events.getActiveId();
    if (!eventId) return { tables: [], total: 0 };

    const where = {
      eventId,
      isStaging: false,
      ...(search
        ? { name: { contains: search, mode: 'insensitive' as const } }
        : {}),
    };

    const [rows, total] = await Promise.all([
      prisma.table.findMany({
        where,
        orderBy: { no: 'asc' },
        skip: (page - 1) * count,
        take: count,
        include: { _count: { select: { people: true } } },
      }),
      prisma.table.count({ where }),
    ]);

    return { tables: rows.map((r) => this.toDto(r)), total };
  }

  async findStaged() {
    const rows = await prisma.table.findMany({
      where: { isStaging: true },
      orderBy: { no: 'asc' },
      include: { _count: { select: { people: true } } },
    });
    return rows.map((r) => this.toDto(r));
  }

  async findOne(id: string) {
    const table = await prisma.table.findUnique({
      where: { id },
      include: { _count: { select: { people: true } } },
    });
    if (!table) throw new NotFoundException('Table not found');
    return this.toDto(table);
  }

  private async nextNo(tx = prisma): Promise<number> {
    const max = await tx.table.aggregate({ _max: { no: true } });
    return (max._max.no ?? 0) + 1;
  }

  async create(dto: CreateTableDto) {
    const isStaging = dto.isStaging ?? false;
    const eventId = isStaging ? null : await this.events.getActiveId();
    const capacity =
      dto.capacity ??
      (await this.config.get<number>(CONFIG_KEYS.defaultTableCapacity));
    return prisma.table.create({
      data: {
        id: uuidv4(),
        name: dto.name,
        capacity,
        isStaging,
        no: await this.nextNo(),
        eventId,
      },
    });
  }

  async bulkCreate(dto: BulkCreateTableDto) {
    const isStaging = dto.isStaging ?? true;
    const eventId = isStaging ? null : await this.events.getActiveId();
    const start = await this.nextNo();
    const data = Array.from({ length: dto.count }, (_, i) => ({
      id: uuidv4(),
      name: `Table ${start + i}`,
      capacity: dto.capacity,
      isStaging,
      no: start + i,
      eventId,
    }));
    await prisma.table.createMany({ data });
    return { created: data.length };
  }

  async update(id: string, dto: UpdateTableDto) {
    await this.findOne(id);
    return prisma.table.update({ where: { id }, data: dto });
  }

  async updatePosition(id: string, x: number, y: number) {
    await this.findOne(id);
    return prisma.table.update({ where: { id }, data: { x, y } });
  }

  async remove(id: string) {
    await this.findOne(id);
    await prisma.table.delete({ where: { id } });
    return { id };
  }

  async bulkRemove(ids: string[]) {
    await prisma.table.deleteMany({ where: { id: { in: ids } } });
    return { removed: ids.length };
  }

  async bulkReassign(ids: string[], eventId: string | null) {
    if (eventId) {
      const event = await prisma.event.findUnique({ where: { id: eventId } });
      if (!event) throw new BadRequestException('Target event not found');
    }
    await prisma.table.updateMany({
      where: { id: { in: ids } },
      data: { eventId, isStaging: eventId === null },
    });
    return { reassigned: ids.length };
  }
}
