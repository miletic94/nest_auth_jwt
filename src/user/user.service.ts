import {Injectable} from '@nestjs/common';

@Injectable()
export class UserService {
    constructor() {}

    getAll() {
        return {res: 'OK'}
    }

    create() {
        return {res: 'creating'}
    }

    update() {
        return {res: 'updating'}
    }

    delete() {
        return {res: 'deleting'}
    }
}