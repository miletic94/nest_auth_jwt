import { Controller, Get, Patch, Delete, Body, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { GetCurrentUser } from 'src/auth/decorator/get-current-user.decorator';
import { Public } from 'src/auth/decorator/public.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@ApiBearerAuth()
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user')
  getAllUsers() {
    return this.userService.getAll();
  }

  @Patch('user')
  updateUser(
    @Body() updateUserData: UpdateUserDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.userService.update(userId, updateUserData);
  }

  @Delete('user')
  deleteUser(@GetCurrentUser('userId') userId: string) {
    return this.userService.delete(userId);
  }

  @Public()
  @Get('test')
  test(@Req() request: Request) {
    return request.headers;
  }
}
