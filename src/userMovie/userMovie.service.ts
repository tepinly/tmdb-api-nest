import { Injectable } from '@nestjs/common';
import { CreateUserMovieDto } from './dto/create-userMovie.dto';
import { UserMovieRepository } from './userMovie.repository';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UserMovieService {
  constructor(private readonly userMovieRepository: UserMovieRepository) {}

  async create(createUserMovieDto: CreateUserMovieDto) {
    return this.userMovieRepository.create(createUserMovieDto);
  }

  async favoriteMovie(args: { movieId: number; userId: number }) {
    const { userId, movieId } = args;

    const userMovie = await this.userMovieRepository.findOne({
      movieId: movieId,
      userId: userId,
    });

    if (!userMovie) {
      return await this.userMovieRepository.create({
        userId,
        movieId,
        isFavorite: true,
      });
    }

    await this.userMovieRepository.update(args, {
      isFavorite: !userMovie.isFavorite,
    });
  }

  async findOne(args: { movieId: number; userId: number }) {
    return this.userMovieRepository.findOne(args);
  }

  async rateMovie(
    args: { movieId: number; userId: number },
    rating: number,
    prisma?: PrismaClient,
  ) {
    const userMovie = await this.userMovieRepository.findOne(args);

    if (!userMovie) {
      return await this.userMovieRepository.create(
        {
          ...args,
          rating,
        },
        prisma,
      );
    }

    await this.userMovieRepository.update(args, { rating: rating }, prisma);
  }

  async remove(args: { movieId: number; userId: number }) {
    return this.userMovieRepository.delete(args);
  }
}
