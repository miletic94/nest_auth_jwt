import {Controller, Post, Body, HttpException, HttpStatus, UseGuards, Request} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { User } from "src/user/entity/user.entity";
import { AuthService } from "./auth.service";
import { GetCurrentUser } from "./decorator/get-current-user.decorator";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { UserAuth } from "./entity/user-auth.entity";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { RefreshTokenGuard } from "./guards/refresh-token.guard";


@ApiTags('Auth')
@ApiBearerAuth()
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/auth/register')
    register(@Body() registerBody: RegisterDto) {
        const user = this.authService.register(registerBody);

        if (user) {
            return user
          } else {
            throw new HttpException('Bad request', HttpStatus.BAD_REQUEST)
          }
    }

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    login(
      @Request() req: Request, 
      @Body() loginDto: LoginDto,
      @GetCurrentUser() user: User
      ) {
        return this.authService.login(user)
    }

    @UseGuards(RefreshTokenGuard)
    @Post('auth/refresh')
    async refreshTokens(
      @GetCurrentUser('sub') userId: string,
      @GetCurrentUser('refreshToken') refreshToken: string
    ) {
      console.log({userId});
      return await this.authService.refreshTokens(userId, refreshToken)
    }
}