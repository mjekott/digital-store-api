import { Controller, Get, Query } from '@nestjs/common';
import { Roles } from 'src/auth/decorator/role.decorator';
import { FindUserQueryParamsDto } from './dto/find-user.dto';
import { userTypes } from './user.schema';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(userTypes.CUSTOMER)
  @Get()
  findAll(@Query() query: FindUserQueryParamsDto) {
    return this.userService.getUsers(query?.type);
  }
}
