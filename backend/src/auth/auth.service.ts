import { Injectable } from '@nestjs/common';
import { EventService } from '@modules/event/event.service';
import { ConfigService } from '@modules/config/config.service';

@Injectable()
export class AuthService {
  constructor(
    private events: EventService,
    private config: ConfigService,
  ) {}

  async verifyAdmin(passphrase: string) {
    const expected = await this.config.getAdminPassphrase();
    return { valid: Boolean(expected) && passphrase === expected };
  }

  async verifyPin(pin: string) {
    const meta = await this.events.getActiveMeta();
    if (!meta || meta.pin !== pin) {
      return { valid: false, eventId: null };
    }
    return { valid: true, eventId: meta.id };
  }
}
