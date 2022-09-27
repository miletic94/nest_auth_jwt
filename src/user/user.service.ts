import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>
    ) {}

    async getOneByEmail(email: string) {
        const user = await this.userRepo.find({where: {email}})
        if(!user) {
            throw new HttpException(`User with that email couldn't be found`, HttpStatus.BAD_REQUEST)
        }
        return user
    }

    async getOneByEmailWithPassword(email: string) {
        const user = await this.userRepo
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.user_auth', 'user_auth')
        .getOne()
        if(!user) {
            throw new HttpException(`User with that email couldn't be found`, HttpStatus.BAD_REQUEST)
        }
        return user
    }

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