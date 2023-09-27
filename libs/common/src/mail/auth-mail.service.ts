import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthServiceMail {
  constructor(private readonly mailService: MailerService) {}

  async sendVerificationCode(data: { email: string; otp: string }) {
    const message = `Your verification code is: ${data.otp}. This code will expire in 10 minutes.`;
    const payload: ISendMailOptions = {
      subject: 'Email Verification Code',
      to: data.email,
      text: message,
    };

    return this.mailService.sendMail(payload);
  }

  async sendEmailVerificationSuccess(data: { email: string }) {
    const message = `Your email has been verified successfully. Thank you for choosing our service.`;
    const payload: ISendMailOptions = {
      subject: 'Email Verification Success',
      to: data.email,
      text: message,
    };

    return this.mailService.sendMail(payload);
  }

  async sendPasswordChangeSuccess(data: { email: string }) {
    const message = `Your password has been changed successfully. If you didn't make this change, please contact us immediately.`;
    const payload: ISendMailOptions = {
      subject: 'Password Change Success',
      to: data.email,
      text: message,
    };

    return this.mailService.sendMail(payload);
  }

  async sendPasswordResetCode(data: { email: string; code: string }) {
    const message = `Your password reset code is: ${data.code}. This code will expire in 10 minutes.`;
    const payload: ISendMailOptions = {
      subject: 'Password Reset Code',
      to: data.email,
      text: message,
    };

    return this.mailService.sendMail(payload);
  }
}
