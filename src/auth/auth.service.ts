import {Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { UserAuth } from './entity/user-auth.entity';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserAuth) private userAuthRepo: Repository<UserAuth>,
        private readonly userService: UserService
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.getOneByEmailWithPassword(email);
        const hashedPassword = user.user_auth['password'] // Manage differently
        const isValid = await bcrypt.compare(password, hashedPassword)
        if (isValid) {
            const {user_auth, ...result} = user
            return result;
        }
        return null;
      }

    async register(newUser: RegisterDto) {
        const { password } = newUser
        const user = await this.userService.create({name: newUser.name, email: newUser.email})
        if(user) {
            const tempPass = this.userAuthRepo.create({password, user})
            await this.userAuthRepo.save(tempPass)
            return user
        }
    }

    login() {
        return
    }
}