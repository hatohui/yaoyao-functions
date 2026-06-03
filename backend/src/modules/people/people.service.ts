import { Injectable } from "@nestjs/common";
import { prisma } from "../../libs/prisma";

@Injectable()
export class PeopleService {
  findAll() {
    return prisma.people.findMany();
  }

  findByTableId(tableId: string) {
    return prisma.people.findMany({ where: { tableId } });
  }
}
