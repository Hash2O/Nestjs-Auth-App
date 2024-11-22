import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getSingleUser(@Param() params: {id: string}) {
    return this.usersService.getSingleUser(params.id);
  }

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }
}
