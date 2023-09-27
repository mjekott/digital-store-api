import { AuthServiceMail } from '@app/common';
import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';

@Injectable()
@Processor('auth-email')
export class AuthEmailProcessor {
  constructor(private readonly authServiceMail: AuthServiceMail) {}
  @Process('verify-email')
  async handleVerifyEmail(job: { data: { email: string; otp: string } }) {
    try {
      await this.authServiceMail.sendVerificationCode(job.data);
    } catch (error) {
      console.log(error);
    }
  }

  @Process('verify-email-success')
  async handleVerifyEmailSuccess(job: { data: { email: string } }) {
    try {
      await this.authServiceMail.sendEmailVerificationSuccess(job.data);
    } catch (error) {
      console.log(error);
    }
  }

  @Process('reset-password-email-success')
  async handleResetPasswordSuccess(job: { data: { email: string } }) {
    try {
      await this.authServiceMail.sendPasswordChangeSuccess(job.data);
    } catch (error) {
      console.log(error);
    }
  }

  @Process('reset-password-mail')
  async handleResetPassword(job: { data: { email: string; code: string } }) {
    try {
      await this.authServiceMail.sendPasswordResetCode(job.data);
    } catch (error) {
      console.log(error);
    }
  }
}
