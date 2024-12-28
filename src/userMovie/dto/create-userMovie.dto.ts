import { IsBoolean, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class CreateUserMovieDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  movieId: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  rating?: number;

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;
}
