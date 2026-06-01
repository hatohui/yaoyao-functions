import { Injectable } from '@nestjs/common';
import { prisma } from '../../prisma';

@Injectable()
export class AccountService {
  findAll() {
    return prisma.account.findMany({
      select: { userId: true, username: true },
    });
  }
}
