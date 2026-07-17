import { Injectable } from '@nestjs/common';
import { prisma } from '../libs/prisma';
import { getAdminPassphrase } from '@common/auth/admin';

@Injectable()
export class AuthService {
  verifyAdmin(passphrase: string) {
    return { valid: passphrase === getAdminPassphrase() };
  }

  async verifyPin(pin: string) {
    const event = await prisma.event.findFirst({
      where: { isActive: true },
      select: { id: true, pin: true },
    });
    if (!event || event.pin !== pin) {
      return { valid: false, eventId: null };
    }
    return { valid: true, eventId: event.id };
  }
}
