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


    async getOne(id: string): Promise<User> {
        const user = await this.userRepo.findOne({where: {id}})
        if (!user) {
          throw new HttpException('Users not found', HttpStatus.NOT_FOUND)
        }
        return user
      }

    async getOneByEmail(email: string): Promise<User> {
        const user = await this.userRepo.findOne({where: {email}})
        if(!user) {
            throw new HttpException(`User with that email couldn't be found`, HttpStatus.BAD_REQUEST)
        }
        return user
    }

    async getOneWithCredentialsBy(property: string, value: string) {
        const user = await this.userRepo
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.user_auth', 'user_auth')
        .where({[property]: value})
        .getOne()
        if(!user) {
            throw new HttpException(`User with that ${property} couldn't be found`, HttpStatus.BAD_REQUEST)
        }
        return user
    }

    async getAll(): Promise<User[]> {
        return await this.userRepo.find()
    }

    async create(user: UserDto) {
        const { name, email} = user
        const alreadyUser = await this.userRepo.findOne({where: {email}})
        if (alreadyUser) throw new HttpException('User with this email already exists.', HttpStatus.BAD_REQUEST)
          
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