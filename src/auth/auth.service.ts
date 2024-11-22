import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDTO } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'; 
import { jwtSecret } from '../utils/constants';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

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

    async signin(dto: AuthDTO) 
    {
        const { email, password } = dto;

        //check for email is unique and already exists in db. If no, send error msg
        const foundUser = await this.prisma.user.findUnique({where: {email}})
        if(!foundUser) {
            throw new BadRequestException('User not found. Wrong credentials.')
        }

        const isMatch = await this.comparePasswords(
            password,
            foundUser.hashedPassword,
        );

        if(!isMatch) {
            throw new BadRequestException('User not found. Wrong credentials.')
        }

        //Sign JWT and return to the user
        const token = await this.signToken({
            id: foundUser.id,
            email: foundUser.email,
        });

        return { token, message: 'Successful signin, nice to see you again !'};
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

    //Helper function to compare passwords
    async comparePasswords(password: string, hash: string)
    {
        return await bcrypt.compare(password, hash);
    }

    //Helper function to assign token
    async signToken(args: {id: string, email: string}) {
        const payload = args

        return this.jwt.signAsync(payload, {secret: jwtSecret})
    }
}
