import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async getSingleUser(id: string) {
        return await this.prisma.user.findUnique({where: {id}, select: {id: true, email: true}});
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
