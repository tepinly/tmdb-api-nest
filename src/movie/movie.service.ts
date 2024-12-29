import { Injectable, NotFoundException } from '@nestjs/common';
import { MovieRepository } from './movie.repository';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { getPagination } from '../helpers/pagination.helper';
import { UserService } from '../user/user.service';
import { UserMovieService } from '../userMovie/userMovie.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class MovieService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly movieRepository: MovieRepository,
    private readonly userService: UserService,
    private readonly userMovieService: UserMovieService,
  ) {}

  async findAll(args?: { search?: string }) {
    return this.movieRepository.findAll(args);
  }

  async findAllPaginated(args: {
    page: number;
    limit: number;
    search?: string;
    genres?: string[];
  }) {
    const { page, limit } = getPagination({
      page: args.page,
      limit: args.limit,
    });
    const { records, total } = await this.movieRepository.findAllPaginated({
      ...(args.search && { search: args.search }),
      ...(args.genres && { genres: args.genres }),
      page,
      limit,
    });

    const recordsTransformed = records.map((record) => ({
      ...record,
      genres: record.genreMovies.map((gm) => gm.genre.name),
    }));

    return { records: recordsTransformed, page: page + 1, limit, total };
  }

  async findOne(id: number) {
    const record = await this.movieRepository.findOne(id);
    if (!record) {
      throw new NotFoundException('Movie not found');
    }

    return record;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    return this.movieRepository.update(id, updateMovieDto);
  }

  async rateMovie(args: { movieId: number; userId: number }, rating: number) {
    const movie = await this.movieRepository.findOne(args.movieId);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    const userMovie = await this.userMovieService.findOne(args);
    const oldRating = userMovie ? userMovie.rating : 0;

    const ratingSum = movie.ratingAvg * movie.ratingCount;
    const newRatingSum = ratingSum - oldRating + rating;

    const newRatingCount = userMovie
      ? movie.ratingCount
      : movie.ratingCount + 1;
    const ratingAvg = newRatingSum / newRatingCount;

    await this.prismaService.$transaction(async (prisma: PrismaClient) => {
      await this.movieRepository.update(args.movieId, {
        ratingAvg,
        ratingCount: newRatingCount,
      });

      await this.userMovieService.rateMovie(args, rating, prisma);
    });
  }

  async favoriteMovie(args: { movieId: number; userId: number }) {
    const { movieId, userId } = args;

    const movie = await this.movieRepository.findOne(movieId);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userMovieService.favoriteMovie({
      movieId,
      userId,
    });
  }
}
