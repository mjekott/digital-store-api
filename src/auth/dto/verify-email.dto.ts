import { Injectable } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

@Injectable()
export class VerifyEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6)
  code: string;
}

@Injectable()
export class SendEmailVerificationDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
