import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async getSingleUser(id: string, req: Request) {
        const user =  await this.prisma.user.findUnique({where: {id}});

        //Ensure no user can fetch profile of another user (admin role will come later !)

        //Try catch
        if(!user) {
            throw new NotFoundException()
        }

        const decodedUser = req.user as {id: string, email: string};

        //Blocking request 
        if(user.id !== decodedUser.id) {
            throw new ForbiddenException()
        }

        delete user.hashedPassword;

        return { user };
    }

    //Only show id and email when returning users list
    async getAllUsers() {
        return await this.prisma.user.findMany({
            select: {
                id: true,
                email: true
            },
        });
    }
}
