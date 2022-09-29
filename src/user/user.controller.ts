import {
  Controller,
  Get,
  Patch,
  Delete,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/auth/decorator/get-current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
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
  deleteUser(
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.userService.delete(userId);
  }
}
