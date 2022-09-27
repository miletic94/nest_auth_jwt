import {Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { UserAuth } from './entity/user-auth.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserAuth) private userAuthRepo: Repository<UserAuth>,
        private readonly userService: UserService
    ) {}

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
        return {res: 'logging in'}
    }
}