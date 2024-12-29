import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { MovieRepository } from './movie.repository';
import { UserService } from '../user/user.service';
import { UserMovieService } from '../userMovie/userMovie.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockMovieRepository = {
  findAllPaginated: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
};

const mockUserMovieService = {
  findOne: jest.fn(),
  rateMovie: jest.fn(),
};

const mockPrismaService = {
  $transaction: jest.fn(),
};

describe('MovieService', () => {
  let service: MovieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        { provide: MovieRepository, useValue: mockMovieRepository },
        { provide: UserService, useValue: {} },
        { provide: UserMovieService, useValue: mockUserMovieService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllPaginated', () => {
    it('should return paginated movies', async () => {
      const mockMovies = [
        {
          id: 1,
          title: 'Movie 1',
          genreMovies: [{ genre: { name: 'Genre 1' } }],
        },
        {
          id: 2,
          title: 'Movie 2',
          genreMovies: [{ genre: { name: 'Genre 2' } }],
        },
      ];
      mockMovieRepository.findAllPaginated.mockResolvedValue({
        records: mockMovies,
        total: 2,
      });

      const result = await service.findAllPaginated({
        page: 1,
        limit: 10,
        search: 'Movie',
        genres: ['Genre 1'],
      });

      expect(result).toEqual({
        records: [
          {
            id: 1,
            title: 'Movie 1',
            genreMovies: [{ genre: { name: 'Genre 1' } }],
            genres: ['Genre 1'],
          },
          {
            id: 2,
            title: 'Movie 2',
            genreMovies: [{ genre: { name: 'Genre 2' } }],
            genres: ['Genre 2'],
          },
        ],
        page: 1,
        limit: 10,
        total: 2,
      });
    });
  });

  describe('findOne', () => {
    it('should return a movie', async () => {
      const mockMovie = { id: 1, title: 'Movie 1' };
      mockMovieRepository.findOne.mockResolvedValue(mockMovie);

      const result = await service.findOne(1);
      expect(result).toEqual(mockMovie);
    });

    it('should throw NotFoundException if movie not found', async () => {
      mockMovieRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a movie', async () => {
      const mockMovie = { id: 1, title: 'Updated Movie' };
      mockMovieRepository.update.mockResolvedValue(mockMovie);

      const result = await service.update(1, { title: 'Updated Movie' });
      expect(result).toEqual(mockMovie);
    });
  });

  describe('rateMovie', () => {
    it('should update the movie rating', async () => {
      const mockMovie = { id: 1, ratingAvg: 4, ratingCount: 1 };
      const mockUserMovie = { rating: 4 };

      mockMovieRepository.findOne.mockResolvedValue(mockMovie);
      mockUserMovieService.findOne.mockResolvedValue(mockUserMovie);

      mockPrismaService.$transaction.mockImplementation(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
        async (callback: Function) => {
          await callback(mockPrismaService);
        },
      );

      await service.rateMovie({ movieId: 1, userId: 1 }, 5);

      expect(mockMovieRepository.update).toHaveBeenCalledWith(1, {
        ratingAvg: 5,
        ratingCount: 1,
      });
      expect(mockUserMovieService.rateMovie).toHaveBeenCalledWith(
        { movieId: 1, userId: 1 },
        5,
        expect.anything(),
      );
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
    });

    it('should throw NotFoundException if movie not found', async () => {
      mockMovieRepository.findOne.mockResolvedValue(null);

      await expect(
        service.rateMovie({ movieId: 1, userId: 1 }, 5),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
