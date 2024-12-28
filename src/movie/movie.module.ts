import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { MovieRepository } from './movie.repository';
import { UserMovieService } from '../userMovie/userMovie.service';
import { UserService } from '../user/user.service';
import { UserMovieModule } from '../userMovie/userMovie.module';
import { UserModule } from '../user/user.module';
import { UserRepository } from '../user/user.repository';
import { UserMovieRepository } from '../userMovie/userMovie.repository';

@Module({
  imports: [UserModule, UserMovieModule],
  controllers: [MovieController],
  providers: [
    MovieService,
    MovieRepository,
    UserService,
    UserRepository,
    UserMovieService,
    UserMovieRepository,
  ],
})
export class MovieModule {}
