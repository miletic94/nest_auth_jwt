import {Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>
    ) {}

    async getAll() {
        return await this.userRepo.createQueryBuilder('user')
        .leftJoinAndSelect('user.user_auth', 'user_auth')
        .getMany();
    }

    async create(user: UserDto) {
        const { name, email} = user
        const tempUser = this.userRepo.create({name, email})
        const dbUser = await this.userRepo.save(tempUser)
        return dbUser
    }

    update() {
        return {res: 'updating'}
    }

    delete() {
        return {res: 'deleting'}
    }
}