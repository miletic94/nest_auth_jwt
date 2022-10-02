import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserAuth } from './entity/user-auth.entity';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RefreshTokenStrategy } from './strategy/jwt-refresh.strategy';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { RefreshTokenModule } from 'src/refresh-token/refresh-token.module';
import { RefreshToken } from 'src/refresh-token/entity/refresh-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAuth, User, RefreshToken]),
    PassportModule,
  ],
  providers: [
    AuthService,
    UserService,
    JwtService,
    LocalStrategy,
    JwtStrategy,
    RefreshTokenStrategy,
    RefreshTokenService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
