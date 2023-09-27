import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { AuthServiceMail } from './auth-mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'Mailgun',
        host: 'smtp.mailgun.org',
        port: 587,
        auth: {
          user: 'postmaster@sandbox042a556d1b11416b8a805cf980eabc91.mailgun.org',
          pass: '68613c335d76311ddd93a90d4f0ded7a-156db0f1-b033cbf2',
        },
      },
      defaults: {
        from: '"Digital Shop" <digitalshop@mail.com>',
      },
    }),
  ],
  providers: [AuthServiceMail],
  exports: [AuthServiceMail],
})
export class MailModule {}
