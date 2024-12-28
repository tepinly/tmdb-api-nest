import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserMovieDto } from './dto/create-userMovie.dto';
import { UpdateUserMovieDto } from './dto/update-userMovie.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UserMovieRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateUserMovieDto, prisma?: PrismaClient) {
    const query = { data };
    return await (prisma
      ? prisma.userMovie.create(query)
      : this.prismaService.userMovie.create(query));
  }

  async findOne(args: { movieId: number; userId: number }) {
    return this.prismaService.userMovie.findUnique({
      where: { userId_movieId: args },
    });
  }

  async update(
    args: { movieId: number; userId: number },
    data: UpdateUserMovieDto,
    prisma?: PrismaClient,
  ) {
    const query = {
      where: { userId_movieId: args },
      data,
    };
    return await (prisma
      ? prisma.userMovie.update(query)
      : this.prismaService.userMovie.update(query));
  }

  async delete(args: { movieId: number; userId: number }) {
    return this.prismaService.userMovie.delete({
      where: { userId_movieId: args },
    });
  }
}
