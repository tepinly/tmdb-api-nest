import { IsString, IsNumber, IsDate } from 'class-validator';

export class CreateMovieDto {
  @IsNumber()
  tmdbId: number;

  @IsString()
  title: string;

  @IsNumber()
  ratingAvg: number;

  @IsNumber()
  ratingCount: number;

  @IsDate()
  releaseDate: Date;
}
