import { IsNumber, IsNotEmpty } from 'class-validator';

export class RateMovieDto {
  @IsNumber()
  @IsNotEmpty()
  rating: number;
}
