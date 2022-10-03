import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/auth/decorator/get-current-user.decorator';
import { Public } from 'src/auth/decorator/public.decorator';
import { RefreshTokenGuard } from 'src/auth/guards/refresh-token.guard';
import { RefreshTokenService } from './refresh-token.service';

@ApiTags('Refresh Token')
@ApiBearerAuth()
@Controller()
export class RefreshTokenController {
  constructor(private refreshTokenService: RefreshTokenService) {}
  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token/refresh')
  async refreshTokens(
    @GetCurrentUser('sub') userId: string,
    @GetCurrentUser('name') userName: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return await this.refreshTokenService.refreshTokens(
      refreshToken,
      userId,
      userName,
    );
  }
}
