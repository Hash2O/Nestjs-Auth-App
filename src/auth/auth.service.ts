import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDTO } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'; 
import { jwtSecret } from '../utils/constants';
import { Request, Response } from 'express';

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

    async signin(dto: AuthDTO, req: Request, res: Response) 
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

        //Stop the function is no token has been found
        if(!token) {
            throw new ForbiddenException()
        }

        //if token is found, send it to the client in a cookie
        res.cookie('token', token);

        return res.send({message: 'Logged in successfully. Nice to see you again !'});
    }

    async signout(req: Request, res: Response) {
        res.clearCookie('token');
        return res.send({message: 'You have been logged out successfully. See you soon !'});
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
