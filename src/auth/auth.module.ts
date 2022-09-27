import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/entity/user.entity";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserAuth } from "./entity/user-auth.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserAuth, User]),
        UserModule,
    ],
    providers: [AuthService, UserService],
    controllers: [AuthController]
})
export class AuthModule {}