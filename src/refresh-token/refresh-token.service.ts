import {
  Injectable,
  HttpException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'src/auth/interface/user-jwt-payload.interface';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { RefreshToken } from './entity/refresh-token.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
  ) {}

  async getTokens(payload: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: payload.sub,
          name: payload.username,
        },
        {
          secret: process.env.JWT_ACCESS_TOKEN_SECRET,
          expiresIn: process.env.JWT_ACCESS_TOKEN_EXP_TIME,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: payload.sub,
          name: payload.username,
        },
        {
          secret: process.env.JWT_REFRESH_TOKEN_SECRET,
          expiresIn: process.env.JWT_REFRESH_TOKEN_EXP_TIME,
        },
      ),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async create(user: User, refrehToken: string, deviceId: string) {
    const deviceIdExists = await this.refreshTokenRepo.findOne({
      where: { device_id: deviceId },
    });
    if (deviceIdExists)
      throw new HttpException(
        'User already logged in from this device',
        HttpStatus.BAD_REQUEST,
      );

    let refreshTokenDB = this.refreshTokenRepo.create({
      value: refrehToken,
      user,
      device_id: deviceId,
    });
    return await this.refreshTokenRepo.save(refreshTokenDB);
  }

  async findOneByRefreshToken(refreshToken: string) {
    const refreshTokenDB = await this.refreshTokenRepo.findOne({
      where: { value: refreshToken },
    });
    if (!refreshTokenDB)
      throw new HttpException(
        'Refresh token not found',
        HttpStatus.BAD_REQUEST,
      );
    return refreshTokenDB;
  }

  async updateRefreshToken(oldRefreshToken, newRefreshToken: string) {
    await this.refreshTokenRepo.update(
      { value: oldRefreshToken },
      { value: newRefreshToken },
    );
  }

  async refreshTokens(refreshToken: string, userId: string, userName: string) {
    const refrehTokenDB = await this.findOneByRefreshToken(refreshToken);

    const refreshTokenMatches = refreshToken === refrehTokenDB.value;

    if (!refreshTokenMatches)
      throw new ForbiddenException(`Refresh tokens doesn't match.`);

    const payload = {
      username: userName,
      sub: userId,
    };
    const tokens = await this.getTokens(payload);
    await this.updateRefreshToken(refreshToken, tokens.refresh_token);
    return tokens;
  }

  async delete(id: string) {
    await this.refreshTokenRepo.delete(id);
    return { message: 'Refresh token deleted' };
  }
}
