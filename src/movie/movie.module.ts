import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MovieRepository } from './movie.repository';

@Module({
  controllers: [MovieController],
  providers: [MovieService, MovieRepository, PrismaService],
})
export class MovieModule {}
