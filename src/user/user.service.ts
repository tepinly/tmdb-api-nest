import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly UserRepository: UserRepository) {}

  findOne(id: number) {
    return this.UserRepository.findOne(id);
  }
}
