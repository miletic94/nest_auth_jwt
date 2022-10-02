import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/auth/decorator/get-current-user.decorator';
import { Public } from 'src/auth/decorator/public.decorator';
import { User } from 'src/user/entity/user.entity';
import { RefreshTokenService } from './refresh-token.service';

@ApiTags('Refresh Token')
@Controller()
export class RefreshTokenController {
  constructor(private refreshTokenService: RefreshTokenService) {}
}
