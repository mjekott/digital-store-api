import { Injectable } from '@nestjs/common';
import { IsEmail, IsIn, IsNotEmpty, IsString, Length } from 'class-validator';
import { userTypes } from '../user.schema';

@Injectable()
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 80)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 24)
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsIn([userTypes.ADMIN, userTypes.CUSTOMER])
  type: string;
}
