import { PrismaService } from '../prisma.service';
import { TmdbService } from '../../tmdb/tmdb.service';

export async function seedMovies(
  prismaService: PrismaService,
  tmdbService: TmdbService,
) {
  const response = await tmdbService.getPopularMovies();
  const movies = response.data.results;
  const moviesMapped = [];
  const movieGenres = [];

  movies.forEach((movie: Record<string, any>) => {
    moviesMapped.push({
      tmdbId: movie.id,
      title: movie.title,
      ratingAvg: movie.vote_average,
      ratingCount: movie.vote_count,
      releaseDate: new Date(movie.release_date),
    });

    movie.genre_ids.forEach((genreId: number) => {
      movieGenres.push({
        movieTmdbId: movie.id,
        genreTmdbId: genreId,
      });
    });
  });

  await prismaService.movie.createMany({
    data: moviesMapped,
  });

  await prismaService.genreMovie.createMany({
    data: movieGenres,
  });
}
