import { Controller, Get, Param, Query } from '@nestjs/common';
import { MovieService } from './movie.service';

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
  ) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 5;

    return this.movieService.findAllPaginated({
      page: pageNumber,
      limit: limitNumber,
      search,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movieService.findOne(+id);
  }
}
