import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { prisma } from '../prisma';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}

  async login(dto: LoginDto) {
    const account = await prisma.account.findUnique({
      where: { username: dto.username },
    });
    if (!account) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, account.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwt.sign({ sub: account.userId, username: account.username });
    return { access_token: token, userId: account.userId, username: account.username };
  }

  async register(dto: RegisterDto) {
    const existing = await prisma.account.findUnique({
      where: { username: dto.username },
    });
    if (existing) throw new ConflictException('Username already taken');

    const hash = await bcrypt.hash(dto.password, 10);
    const account = await prisma.account.create({
      data: { userId: uuidv4(), username: dto.username, password: hash },
    });

    const token = this.jwt.sign({ sub: account.userId, username: account.username });
    return { access_token: token, userId: account.userId, username: account.username };
  }
}
