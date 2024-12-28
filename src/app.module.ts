import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TmdbModule } from './tmdb/tmdb.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MovieModule } from './movie/movie.module';
import { UserModule } from './user/user.module';
import { GenreModule } from './genre/genre.module';
import { UserMovieModule } from './userMovie/userMovie.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        TMDB_API_URL: Joi.string().required(),
        TMDB_API_KEY: Joi.string().required(),
      }),
    }),
    PrismaModule,
    TmdbModule,
    MovieModule,
    UserModule,
    GenreModule,
    UserMovieModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
