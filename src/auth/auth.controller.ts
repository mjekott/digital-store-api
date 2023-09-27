import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ACCESS_TOKEN_KEY } from './constant';
import { Public } from './decorator/public.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  ResetPasswordDto,
  SendResetPasswordDto,
} from './dto/reset-password.dto';
import {
  SendEmailVerificationDto,
  VerifyEmailDto,
} from './dto/verify-email.dto';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(@Body() registerDto: RegisterDto) {
    return await this.authService.registerUser(registerDto);
  }

  @Post('login')
  async loginUser(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const payload = await this.authService.loginUser(loginDto);

    response.cookie(ACCESS_TOKEN_KEY, payload.accessToken, {
      sameSite: 'lax',
      httpOnly: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
    });
    return payload;
  }

  @Post('verify-email')
  async verifyUserEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Get('send-email-verification')
  async sendEmailVerificationCode(
    @Body() sendEmailVerificationDto: SendEmailVerificationDto,
  ) {
    return this.authService.sendEmailVerification(sendEmailVerificationDto);
  }

  @Post('send-reset-password')
  async sendPasswordResetCode(
    @Body() sendResetPasswordDto: SendResetPasswordDto,
  ) {
    return this.authService.sendResetPasswordCode(sendResetPasswordDto);
  }

  @Post('reset-password')
  async resetUserPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('logout')
  async logoutUser(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(ACCESS_TOKEN_KEY);

    return { message: 'Logout Successful' };
  }
}
