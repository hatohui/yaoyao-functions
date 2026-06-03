import { Injectable } from "@nestjs/common";
import { prisma } from "../../libs/prisma";

@Injectable()
export class AccountService {
  findAll() {
    return prisma.account.findMany({
      select: { userId: true, username: true },
    });
  }
}
