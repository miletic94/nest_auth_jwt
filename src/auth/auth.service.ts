import {
  Injectable,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { DataSource, Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { UserAuth } from './entity/user-auth.entity';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entity/user.entity';
import { JwtPayload } from './interface/user-jwt-payload.interface';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserAuth) private userAuthRepo: Repository<UserAuth>,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getOneWithCredentialsBy('email', email);
    const hashedPassword = user.user_auth['password']; // Manage differently
    const isValid = await bcrypt.compare(password, hashedPassword);
    if (isValid) {
      return user;
    }
    return null;
  }

  async register(newUser: RegisterDto) {
    const { password } = newUser;
    const queryRunner = this.dataSource.createQueryRunner();

    queryRunner.connect();
    queryRunner.startTransaction();
    try {
      let user;
      const tempUser = await this.userService.create({
        name: newUser.name,
        email: newUser.email,
      });
      if (tempUser) {
        user = await queryRunner.manager.save(tempUser);
        const tempPass = this.userAuthRepo.create({ password, user });
        await queryRunner.manager.save(tempPass);
      }

      await queryRunner.commitTransaction();
      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  async login(user: User, deviceId: string) {
    const payload: JwtPayload = { sub: user.id, username: user.name };
    const tokens = await this.refreshTokenService.getTokens(payload);
    const refreshToken = await this.refreshTokenService.create(
      user,
      tokens.refresh_token,
      deviceId,
    );
    return { ...tokens, device_id: refreshToken.device_id };
  }

  async logout(userId: string, deviceId: string) {
    const user = await this.userService.getOneWithCredentialsBy('id', userId);
    // Rethink
    const refreshToken = user.refresh_token.find(
      (token) => token.device_id === deviceId,
    );
    if (!refreshToken)
      throw new HttpException('Device id not found', HttpStatus.BAD_REQUEST);
    // =========
    await this.refreshTokenService.deleteRefreshToken(refreshToken.id);
  }

  async getOneById(userAuthId: string) {
    const userAuth = await this.userAuthRepo.findOne({
      where: { id: userAuthId },
    });
    if (!userAuth)
      throw new HttpException(
        `User auth with that id doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );

    return userAuth;
  }
}
