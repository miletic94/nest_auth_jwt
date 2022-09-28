import {Controller, Get, Patch, Delete, UseGuards} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UserService } from "./user.service";

@ApiTags('User')
@ApiBearerAuth()
@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
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