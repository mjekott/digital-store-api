import { HashingService, MailModule, RedisModule } from '@app/common';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthEmailProcessor } from './auth.-mail.processor';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    RedisModule,
    ConfigModule,
    MailModule,
    JwtModule,
    BullModule.registerQueue({
      name: 'auth-email',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthEmailProcessor, HashingService],
})
export class AuthModule {}
