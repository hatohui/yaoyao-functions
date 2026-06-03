import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePresetDto } from "./dto/create-preset.dto";
import { prisma } from "../../libs/prisma";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class PresetMenuService {
  findAll() {
    return prisma.presetMenu.findMany({
      include: { foods: { include: { variant: { include: { food: true } } } } },
    });
  }

  async findOne(id: string) {
    const preset = await prisma.presetMenu.findUnique({
      where: { id },
      include: { foods: { include: { variant: { include: { food: true } } } } },
    });
    if (!preset) throw new NotFoundException("Preset menu not found");
    return preset;
  }

  create(dto: CreatePresetDto) {
    const id = uuidv4();
    return prisma.presetMenu.create({
      data: {
        id,
        price: dto.price,
        isActive: dto.isActive ?? true,
        foods: dto.foods
          ? {
              create: dto.foods.map((f) => ({
                variantId: f.variantId,
                quantity: f.quantity,
              })),
            }
          : undefined,
      },
      include: { foods: true },
    });
  }
}
