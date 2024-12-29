import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { RateMovieDto } from './dto/rate-movie.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.decorator';
import { UserPayload } from '../auth/jwt.strategy';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

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
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  rateMovie(
    @Param('id') id: number,
    @Body() rateMovieDto: RateMovieDto,
    @User() user: UserPayload,
  ) {
    return this.movieService.rateMovie(
      { movieId: +id, userId: user.id },
      rateMovieDto.rating,
    );
  }

  @Post(':id/favorite')
  @UseGuards(JwtAuthGuard)
  async favoriteMovie(@Param('id') id: number, @User() user: UserPayload) {
    await this.movieService.favoriteMovie({
      movieId: +id,
      userId: user.id,
    });

    return {};
  }
}
