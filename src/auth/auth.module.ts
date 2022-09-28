import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/entity/user.entity";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserAuth } from "./entity/user-auth.entity";
import { PassportModule } from "@nestjs/passport"
import { LocalStrategy } from './strategy/local.strategy'
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy/jwt.strategy";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserAuth, User]),
        PassportModule,
        JwtModule.register({
          secret: process.env.JWT_ACCESS_TOKEN_SECRET,
          signOptions: { expiresIn: '15m' },
        }),
    ],
    providers: [AuthService, UserService, LocalStrategy, JwtStrategy],
    controllers: [AuthController]
})
export class AuthModule {}