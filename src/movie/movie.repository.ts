import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MovieRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(args: { search?: string }) {
    return this.prismaService.movie.findMany({
      ...(args.search && {
        where: {
          title: {
            contains: args.search,
          },
        },
      }),
    });
  }

  async findAllPaginated(args: {
    search?: string;
    page: number;
    limit: number;
    genres?: string[];
  }) {
    const where = {
      ...(args.search && {
        title: {
          contains: args.search,
        },
      }),
      ...(args.genres &&
        args.genres.length > 0 && {
          genreMovies: {
            some: {
              genre: {
                name: {
                  in: args.genres,
                },
              },
            },
          },
        }),
    };

    const total = await this.prismaService.movie.count({ where });
    const records = await this.prismaService.movie.findMany({
      where,
      skip: args.page,
      take: args.limit,
      include: {
        genreMovies: {
          select: {
            genre: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return { total, records };
  }

  async findOne(id: number) {
    return this.prismaService.movie.findUnique({
      where: { tmdbId: id },
    });
  }

  async update(id: number, data: any) {
    return this.prismaService.movie.update({
      where: { tmdbId: id },
      data,
    });
  }
}
