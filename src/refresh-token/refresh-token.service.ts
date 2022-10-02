import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { RefreshToken } from './entity/refresh-token.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
  ) {}
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

  async findOneById(id: string) {
    const refreshToken = await this.refreshTokenRepo.findOne({ where: { id } });
    if (!refreshToken)
      throw new HttpException(
        'Refresh token with that id not found',
        HttpStatus.BAD_REQUEST,
      );
  }

  async update(id: string, refreshToken: string) {
    await this.refreshTokenRepo.update({ id }, { value: refreshToken });
  }

  async delete(id: string) {
    await this.refreshTokenRepo.delete(id);
    return { message: 'Refresh token deleted' };
  }
}
