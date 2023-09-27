import { Injectable } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

@Injectable()
export class SendResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

@Injectable()
export class ResetPasswordDto {
  @IsNotEmpty()
  @Length(6, 6, { message: 'code must be exactly 6 characters' })
  code: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 24)
  password: string;
}
