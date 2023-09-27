import { HashingService, MailModule, RedisModule } from '@app/common';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthEmailProcessor } from './auth.-mail.processor';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

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
  providers: [
    AuthService,
    AuthEmailProcessor,
    HashingService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
})
export class AuthModule {}
