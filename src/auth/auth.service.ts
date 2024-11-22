import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDTO } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async signup(dto: AuthDTO) {
        const { email, password } = dto;

        //check for email is unique in db
        const foundUser = await this.prisma.user.findUnique({where: {email}})
        if(foundUser) {
            throw new BadRequestException('Email already exists.')
        }

        //Hashing Pwd with Bcrypt library
        const hashedPassword = await this.hashPassword(password);

        await this.prisma.user.create({
            data: {
                email,
                hashedPassword
            }
        })

        return {message: 'Successful signup, welcome here !'};
    }

    async signin() 
    {
        return {message: 'Successful signin, nice to see you again !'};
    }

    async signout() {
        return {message: 'Successful signout, see you soon !'};
    }


    //Helper function for hashing passwords
    async hashPassword(password: string) {
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltOrRounds);
        return hashedPassword;
    }


}
