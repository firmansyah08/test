import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @ApiTags('User')
    @Get()
    async GetAllUser(
        @Res() res
    ) {
        const users = await this.userService.getUser()

        return res.status(HttpStatus.OK).json({
            status: 'success',
            message: 'success get list user',
            data: users
        })
    }

    @ApiTags('User')
    @Get('/:id')
    async GetUserByCode(
        @Res() res,
        @Param('id') id: string
    ) {
        const user = await this.userService.getUserByCode({ code: id })

        return res.status(HttpStatus.OK).json({
            status: 'success',
            message: 'success get detail user',
            data: user
        })
    }
}
