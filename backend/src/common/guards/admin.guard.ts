import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ADMIN_HEADER } from '@common/auth/admin';
import { ConfigService } from '@modules/config/config.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private config: ConfigService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const provided = request.headers[ADMIN_HEADER];
    const passphrase = await this.config.getAdminPassphrase();

    if (!provided || !passphrase || provided !== passphrase) {
      throw new UnauthorizedException('Invalid admin passphrase');
    }

    return true;
  }
}
