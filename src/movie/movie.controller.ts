import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { UserMovieService } from '../userMovie/userMovie.service';
import { RateMovieDto } from './dto/rate-movie.dto';

@Controller('movies')
export class MovieController {
  constructor(
    private readonly movieService: MovieService,
    private readonly userMovieService: UserMovieService,
  ) {}

  @Get()
  findAll(@Query('search') search?: string) {
    return this.movieService.findAll({ search });
  }

  @Get('paginated')
  findAllPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Query('search') search?: string,
    @Query('genres') genres?: string,
  ) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 5;
    const genresArray = genres ? genres.split(',') : [];

    return this.movieService.findAllPaginated({
      page: pageNumber,
      limit: limitNumber,
      search,
      genres: genresArray,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.movieService.findOne(+id);
  }

  @Post(':id/rate')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  rateMovie(@Param('id') id: number, @Body() rateMovieDto: RateMovieDto) {
    return this.movieService.rateMovie(
      { movieId: +id, userId: 1 },
      rateMovieDto.rating,
    );
  }

  @Post(':id/favorite')
  async favoriteMovie(@Param('id') id: number) {
    await this.movieService.favoriteMovie({
      movieId: +id,
      userId: 1,
    });

    return {};
  }
}
