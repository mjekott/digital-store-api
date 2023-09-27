import { HashingService } from '@app/common';
import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';

import { LoginDto } from 'src/auth/dto/login.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { IUserService } from './user.interface';
import { UserRepository } from './user.respository';

@Injectable()
export class UserService implements IUserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashingService: HashingService,
  ) {}
  async create(data: RegisterDto) {
    const user = await this.userRepository.findOne({ email: data.email });
    if (user) {
      throw new UnprocessableEntityException('Email is already taken');
    }
    const hashedPassword = await this.hashingService.hash(data.password);

    return this.userRepository.create({
      ...data,
      password: hashedPassword,
    });
  }

  async validateUser(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      email: loginDto.email,
    });
    if (
      user &&
      (await this.hashingService.compare(loginDto.password, user.password))
    ) {
      return user;
    }
    return null;
  }
}
