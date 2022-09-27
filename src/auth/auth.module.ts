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

@Module({
    imports: [
        TypeOrmModule.forFeature([UserAuth, User]),
        PassportModule
    ],
    providers: [AuthService, UserService, LocalStrategy],
    controllers: [AuthController]
})
export class AuthModule {}