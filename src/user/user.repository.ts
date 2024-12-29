import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(id: number) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findByUsername(username: string) {
    return this.prismaService.user.findUnique({
      where: {
        username,
      },
    });
  }

  async findAdminUser() {
    return this.prismaService.user.findFirst({
      where: {
        role: Role.ADMIN,
      },
    });
  }
}
