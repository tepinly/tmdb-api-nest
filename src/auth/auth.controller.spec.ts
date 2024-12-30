import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockAuthService = {
  validateUser: jest.fn(),
  login: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call login method of AuthService', async () => {
    const mockUser = {
      username: 'mockUsername',
      password: 'mockPassword',
    };

    mockAuthService.validateUser.mockResolvedValue(mockUser);

    await mockAuthService.validateUser(mockUser.username, mockUser.password);
    await mockAuthService.login(mockUser);

    expect(mockAuthService.validateUser).toHaveBeenCalledWith(
      mockUser.username,
      mockUser.password,
    );
    expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
  });
});
