import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as moment from 'moment';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async getUser(): Promise<User[]> {
        return await this.prisma.user.findMany({
            include: {
                BorrowedBook: {
                    where: { returnedDate: null },
                    include: { book: true }
                }
            }
        })
    }

    async getUserByCode(
        userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    ): Promise<User | null> {
        return await this.prisma.user.findUnique({ where: userWhereUniqueInput })
    }

    async updateUser(params: {
        where: Prisma.UserWhereUniqueInput,
        data: Prisma.UserUpdateInput
    }): Promise<User> {
        const { where, data } = params

        return await this.prisma.user.update({ data, where })
    }

    async checkPenalty(
        data: any
    ): Promise<User> {
        try {
            const { user } = data
            
            // check penalty
            if (user.datePenalized) {
                const currentDate = moment()
                const penalizedDate = moment(user.datePenalized)
                const diffDate = currentDate.diff(penalizedDate, 'days')
                
                if (diffDate <= 3) {
                    throw new BadRequestException('user have penalty')
                } else {
                    await this.prisma.user.update({
                        data: { datePenalized: null },
                        where: { id: user.id }
                    })
                }
            }
    
            return
        } catch (err) {
            throw err
        }
    }
}
