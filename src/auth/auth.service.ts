import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDTO } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async signup(dto: AuthDTO) {
        const { email, password } = dto;
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
