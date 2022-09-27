import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from "../typeorm.config"
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}