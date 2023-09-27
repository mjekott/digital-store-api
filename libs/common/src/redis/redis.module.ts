import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '../config';
@Module({
  imports: [
    NestRedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          config: {
            url: configService.getOrThrow('REDIS_URL'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class RedisModule {}
