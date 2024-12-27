import { Module } from '@nestjs/common';
import { TmdbService } from './tmdb.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [TmdbService],
})
export class TmdbModule {}
