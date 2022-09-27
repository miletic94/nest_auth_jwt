import {Injectable} from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor() {}

    register() {
        return {res: 'registering'}
    }

    login() {
        return {res: 'logging in'}
    }
}