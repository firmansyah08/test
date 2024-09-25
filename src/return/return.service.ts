import { Injectable } from '@nestjs/common';
import { BorrowedBook, Prisma } from '@prisma/client';
import * as moment from 'moment';
import { BookService } from 'src/book/book.service';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ReturnService {
    constructor(
        private prisma: PrismaService,
        private readonly bookService: BookService,
        private readonly userService: UserService
    ) {}

    async returnBook(params: {
        data: any
    }): Promise<BorrowedBook> {        
        const { data } = params
        
        // check returned date not more than 7 days
        const returnedDate = moment()
        const borrowedDate = moment(data.borrowedDate)
        const diffDate = returnedDate.diff(borrowedDate, 'days')
        
        // if diffDate > 7, penalized user
        if (diffDate > 7) {
            await this.userService.updateUser({ data: { datePenalized: new Date() }, where: { id: data.userId } })
        }

        // return borrowed book
        return await this.prisma.borrowedBook.update({ where: { id: data.id }, data: { returnedDate: new Date() } })
    }
}
