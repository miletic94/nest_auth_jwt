import {Controller, Get, Post, Patch, Delete} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";

@ApiTags('User')
@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('user')
    getAllUsers() {
        return this.userService.getAll()
    }
    
    @Patch('user')
    updateUser() {
        return this.userService.update()
    }

    @Delete('user')
    deleteUser() {
        return this.userService.delete()
    }
}