import {Controller, Post, Body, HttpException, HttpStatus, UseGuards, Request} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";


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

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Request() req: Request, @Body() loginDto: LoginDto) {
        return req['user']
    }
}