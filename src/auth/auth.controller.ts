import {Controller, Post, Body, HttpException, HttpStatus} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";


@ApiTags('Auth')
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() registerBody: RegisterDto) {
        const user = this.authService.register(registerBody);

        if (user) {
            return user
          } else {
            throw new HttpException('Bad request', HttpStatus.BAD_REQUEST)
          }
    }

    @Post('login')
    login() {
        this.authService.login();
    }
}