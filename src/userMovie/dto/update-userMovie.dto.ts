import { PartialType } from '@nestjs/mapped-types';
import { CreateUserMovieDto } from './create-userMovie.dto';

export class UpdateUserMovieDto extends PartialType(CreateUserMovieDto) {}
