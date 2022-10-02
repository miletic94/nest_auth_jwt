import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entity/refresh-token.entity';
import { RefreshTokenController } from './refresh-token.controller';
import { RefreshTokenService } from './refresh-token.service';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken])],
  providers: [RefreshTokenService],
  controllers: [RefreshTokenController],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
