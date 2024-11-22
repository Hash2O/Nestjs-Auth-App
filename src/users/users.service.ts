import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async getSingleUser(id: string) {

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
