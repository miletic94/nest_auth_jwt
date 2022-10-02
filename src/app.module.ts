import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from '../typeorm.config';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    AuthModule,
    RefreshTokenModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
