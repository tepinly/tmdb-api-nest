import { TmdbService } from '../../tmdb/tmdb.service';
import { PrismaService } from '../prisma.service';

export async function seedGenres(
  prismaService: PrismaService,
  tmdbService: TmdbService,
) {
  const response = await tmdbService.getMovieGenres();
  const genres = response.data.genres;
  const genresMapped = genres.map((genre: Record<string, any>) => ({
    name: genre.name,
    tmdbId: genre.id,
  }));

  await prismaService.genre.createMany({
    data: genresMapped,
  });
}
