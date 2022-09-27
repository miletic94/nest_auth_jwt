import {Controller, Get, Post, Patch, Delete} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";


@ApiTags('Auth')
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register() {
        this.authService.register();
    }

    @Post('login')
    login() {
        this.authService.login();
    }
}