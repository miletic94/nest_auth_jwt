import { Injectable, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { DataSource, Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { UserAuth } from './entity/user-auth.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entity/user.entity';
import { JwtPayload } from './interface/user-jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserAuth) private userAuthRepo: Repository<UserAuth>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
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
      let user
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
      return user
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    } finally {
      await queryRunner.release();
    }

  }

  async login(user: User) {
    const payload: JwtPayload = { username: user.name, sub: user.id };
    const userAuthId = user.user_auth['id']
    const tokens = await this.getTokens(payload);
    await this.updateRefreshTokenHash(userAuthId, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: string) {
    await this.deleteRefreshToken(userId);
  }

  async deleteRefreshToken(userId: string) {
    const user = await this.userService.getOneWithCredentialsBy('id', userId);
    const userAuthId = user.user_auth['id']
    const userAuth = await this.userAuthRepo.findOne({where: {id: userAuthId}})
    if(!userAuth) throw new HttpException(`User auth with that id doesn't exist`, HttpStatus.BAD_REQUEST) 
    if(userAuth.refreshToken == null) throw new HttpException(`Refresh token already null`, HttpStatus.BAD_REQUEST)
    return this.userAuthRepo.update(
      { id: userAuthId },
      {
        refreshToken: null,
      }
    )
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.getOneWithCredentialsBy('id', userId);
    if (!user) throw new ForbiddenException('No such user in DB');

    if (!user.user_auth['refreshToken']) throw new ForbiddenException('No refresh token in db');

    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.user_auth['refreshToken']);

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const payload = { 
      username: user.name, 
      sub: user.id, 
    };
    const tokens = await this.getTokens(payload);
    await this.updateRefreshTokenHash(user.user_auth['id'], tokens.refresh_token);
    return tokens;
  }

  async updateRefreshTokenHash(userAuthId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.updateRefreshToken(userAuthId, hash);
  }

  async updateRefreshToken(userAuthId: string, refreshToken: string) {

    return this.userAuthRepo.update(
      { id: userAuthId },
      {
        refreshToken,
      }
    )
  }
} 
