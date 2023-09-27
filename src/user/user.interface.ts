import { LoginDto } from 'src/auth/dto/login.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { User } from './user.schema';

export interface IUserService {
  create: (data: RegisterDto) => Promise<User>;
  validateUser: (data: LoginDto) => Promise<User | null>;
}
