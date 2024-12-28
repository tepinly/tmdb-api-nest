import { Test, TestingModule } from '@nestjs/testing';
import { UserMovieService } from './userMovie.service';

describe('UserMovieService', () => {
  let service: UserMovieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserMovieService],
    }).compile();

    service = module.get<UserMovieService>(UserMovieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
