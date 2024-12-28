import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
