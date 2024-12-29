import { seedUsers } from './seeds/user.seed';
import { seedMovies } from './seeds/movie.seed';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { PrismaService } from './prisma.service';
import { TmdbService } from '../tmdb/tmdb.service';
import { seedGenres } from './seeds/genre.seed';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prismaService = app.get(PrismaService);
  const tmdbService = app.get(TmdbService);

  await Promise.all([
    seedUsers(prismaService),
    seedGenres(prismaService, tmdbService),
    seedMovies(prismaService, tmdbService),
  ]);

  await app.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
