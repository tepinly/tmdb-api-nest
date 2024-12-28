import { Module } from '@nestjs/common';
import { UserMovieService } from './userMovie.service';
import { UserMovieRepository } from './userMovie.repository';

@Module({
  providers: [UserMovieService, UserMovieRepository],
  exports: [UserMovieService, UserMovieRepository],
})
export class UserMovieModule {}
