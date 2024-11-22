import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor() {}

    async signup() {
        return {message: 'Successful signup, welcome here !'};
    }

    async signin() 
    {
        return {message: 'Successful signin, nice to see you again !'};
    }

    async signout() {
        return {message: 'Successful signout, see you soon !'};
    }
}
