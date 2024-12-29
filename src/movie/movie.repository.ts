import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { RedisService } from '../redis/redis.service';

export interface PaginatedMovies {
  cacheKey: string;
  total: number;
  records: Array<{
    id: number;
    tmdbId: number;
    title: string;
    ratingAvg: number;
    ratingCount: number;
    releaseDate: Date;
    createdAt: Date;
    updatedAt: Date;
    genreMovies: Array<{
      genre: {
        name: string;
      };
    }>;
  }>;
}

@Injectable()
export class MovieRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async findAll(args: { search?: string }) {
    const cachedResult = await this.redisService.getSingleValue('movies');
    if (cachedResult) {
      console.log('Cache hit');
      return cachedResult;
    }

    const result = await this.prismaService.movie.findMany({
      ...(args.search && {
        where: {
          title: {
            contains: args.search,
          },
        },
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
      }),
    });

    await this.redisService.setSingleValue('movies', result);
    return result;
  }

  async findAllPaginated(args: {
    search?: string;
    page: number;
    limit: number;
    genres?: string[];
  }) {
    const key = this.generatePaginationKey(args);
    const cachedResult = await this.redisService.getSetValue<PaginatedMovies>(
      'paginatedMovies',
      (movie) => movie.cacheKey === key,
    );
    if (cachedResult) {
      return cachedResult;
    }

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

    const result: PaginatedMovies = { cacheKey: key, total, records };
    await this.redisService.addToSet<PaginatedMovies>(
      'paginatedMovies',
      result,
      3600,
    );

    return result;
  }

  async findOne(id: number) {
    return this.prismaService.movie.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: UpdateMovieDto) {
    this.redisService.delete(['paginatedMovies', 'movies']);

    return await this.prismaService.movie.update({
      where: { id },
      data,
    });
  }

  private generatePaginationKey(args: {
    search?: string;
    page: number;
    limit: number;
    genres?: string[];
  }): string {
    const searchParam = args.search || 'all';
    const genresParam = args.genres?.length
      ? args.genres.sort().join('-')
      : 'all';

    return `movies:page=${args.page}:limit=${args.limit}:search=${searchParam}:genres=${genresParam}`;
  }
}
