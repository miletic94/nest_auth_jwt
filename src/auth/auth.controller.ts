import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/entity/user.entity';
import { AuthService } from './auth.service';
import { GetCurrentUser } from './decorator/get-current-user.decorator';
import { Public } from './decorator/public.decorator';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/auth/register')
  register(@Body() registerBody: RegisterDto) {
    const user = this.authService.register(registerBody);

    if (user) {
      return user;
    } else {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  login(@Body() loginDto: LoginDto, @GetCurrentUser() user: User) {
    return this.authService.login(user, loginDto.deviceId);
  }

  @Post('auth/logout')
  async logout(
    @GetCurrentUser('userId') userId: string,
    @Body() logoutDto: LogoutDto,
  ) {
    await this.authService.logout(userId, logoutDto.deviceId);
    return { message: 'User logged out.' };
  }
}
