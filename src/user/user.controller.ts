import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get()
    async GetAllUser(): Promise<UserModel[]> {
        return this.userService.getUser()
    }

    @Get('/:id')
    async GetUserByCode(
        @Param('id') id: string
    ): Promise<UserModel> {
        return this.userService.getUserByCode({ code: id })
    }
}
