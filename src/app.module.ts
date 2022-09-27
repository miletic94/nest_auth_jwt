import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from "../typeorm.config"
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig), UserModule, AuthModule
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}