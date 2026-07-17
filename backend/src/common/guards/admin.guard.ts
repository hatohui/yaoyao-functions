import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ADMIN_HEADER, getAdminPassphrase } from '@common/auth/admin';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const provided = request.headers[ADMIN_HEADER];
    if (!provided || provided !== getAdminPassphrase()) {
      throw new UnauthorizedException('Invalid admin passphrase');
    }
    return true;
  }
}
