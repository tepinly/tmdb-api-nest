import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TmdbModule } from './tmdb/tmdb.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MovieModule } from './movie/movie.module';
import { UserModule } from './user/user.module';
import { UserMovieModule } from './userMovie/userMovie.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';
import { RedisModule } from './redis/redis.module';

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
    RedisModule,
    PrismaModule,
    TmdbModule,
    MovieModule,
    UserModule,
    UserMovieModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
