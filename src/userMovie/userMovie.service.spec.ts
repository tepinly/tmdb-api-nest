import { Test, TestingModule } from '@nestjs/testing';
import { UserMovieService } from './userMovie.service';
import { UserMovieRepository } from './userMovie.repository';
import { CreateUserMovieDto } from './dto/create-userMovie.dto';

const mockUserMovieRepository = {
  create: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
};

describe('UserMovieService', () => {
  let service: UserMovieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserMovieService,
        { provide: UserMovieRepository, useValue: mockUserMovieRepository },
      ],
    }).compile();

    service = module.get<UserMovieService>(UserMovieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a userMovie record', async () => {
      const createUserMovieDto: CreateUserMovieDto = {
        userId: 1,
        movieId: 1,
        rating: 5,
        isFavorite: true,
      };
      const result = { id: 1, ...createUserMovieDto };
      mockUserMovieRepository.create.mockResolvedValue(result);

      expect(await service.create(createUserMovieDto)).toBe(result);
    });
  });

  describe('favoriteMovie', () => {
    it('should create a favorite userMovie record if not exists', async () => {
      const args = { userId: 1, movieId: 1 };
      const result = { id: 1, userId: 1, movieId: 1, isFavorite: true };
      mockUserMovieRepository.findOne.mockResolvedValue(null);
      mockUserMovieRepository.create.mockResolvedValue(result);

      expect(await service.favoriteMovie(args)).toBe(result);
      expect(mockUserMovieRepository.create).toHaveBeenCalledWith({
        userId: 1,
        movieId: 1,
        isFavorite: true,
      });
    });

    it('should update the favorite status if record exists', async () => {
      const args = { userId: 1, movieId: 1 };
      const existingRecord = {
        id: 1,
        userId: 1,
        movieId: 1,
        isFavorite: false,
      };
      const updatedRecord = { ...existingRecord, isFavorite: true };
      mockUserMovieRepository.findOne.mockResolvedValue(existingRecord);
      mockUserMovieRepository.update.mockResolvedValue(updatedRecord);

      expect(await service.favoriteMovie(args)).toBe(updatedRecord);
      expect(mockUserMovieRepository.update).toHaveBeenCalledWith(args, {
        isFavorite: true,
      });
    });
  });
});
