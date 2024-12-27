import { Injectable } from '@nestjs/common';
import { MovieRepository } from './movie.repository';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { getPagination } from 'src/helpers/pagination.helper';

@Injectable()
export class MovieService {
  constructor(private readonly movieRepository: MovieRepository) {}

  async findAll(args?: { search?: string }) {
    return this.movieRepository.findAll(args);
  }

  async findAllPaginated(args: {
    page: number;
    limit: number;
    search?: string;
  }) {
    const { page, limit } = getPagination({
      page: args.page,
      limit: args.limit,
    });
    const { records, total } = await this.movieRepository.findAllPaginated({
      ...(args.search && { search: args.search }),
      page,
      limit,
    });

    return { records, page, limit, total };
  }

  async findOne(id: number) {
    return this.movieRepository.findOne(id);
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    return this.movieRepository.update(id, updateMovieDto);
  }
}
