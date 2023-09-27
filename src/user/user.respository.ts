import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User, userTypes } from './user.schema';

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  protected logger = new Logger(UserRepository.name);

  constructor(@InjectModel(User.name) userModel: Model<User>) {
    super(userModel);
  }

  async getUsers(type?: userTypes): Promise<User[]> {
    const filter: FilterQuery<User> = {};
    if (type) {
      filter.type = type;
    }
    return this.model.find(filter).select('-password');
  }
}
