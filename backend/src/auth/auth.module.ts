import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EventModule } from '@modules/event/event.module';

@Module({
  imports: [EventModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
