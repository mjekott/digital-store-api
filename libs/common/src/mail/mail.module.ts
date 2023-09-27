import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthServiceMail } from './auth-mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          service: 'Mailgun',
          host: configService.get('MAILGUN_HOST'), // Use environment variables from ConfigService
          port: configService.get('MAILGUN_PORT'),
          auth: {
            user: configService.get('MAILGUN_USER'),
            pass: configService.get('MAILGUN_PASS'),
          },
        },
        defaults: {
          from: '"Digital Shop" <digitalshop@mail.com>',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthServiceMail],
  exports: [AuthServiceMail],
})
export class MailModule {}
