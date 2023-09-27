import { DatabaseModule, HashingService } from '@app/common';

import { Module } from '@nestjs/common';
import { UserRepository } from './user.respository';
import { User, userSchema } from './user.schema';
import { UserService } from './user.service';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: User.name, schema: userSchema }]),
  ],
  providers: [UserRepository, UserService, HashingService],
  exports: [UserService, UserRepository],
})
export class UserModule {}
