import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
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
          throw new HttpException('User not found', HttpStatus.NOT_FOUND)
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
        if (alreadyUser) {
            throw new HttpException('User with this email already exists.', HttpStatus.BAD_REQUEST)
        }      
        return this.userRepo.create({name, email})
    }

    async update(userId: string, updateUserData: UpdateUserDto) {
        await this.userRepo.update(
            {id: userId},
            {name: updateUserData.name}
        )
        return this.getOne(userId)
    }

    async delete(id: string) {
        try {
            const user = await this.getOne(id);
            await this.userRepo.delete(id)
            return {message: 'Resource deleted successfully!'}
        } catch(error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }

    }
}