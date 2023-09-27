import { Injectable } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

@Injectable()
export class RegisterDto {
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
}
