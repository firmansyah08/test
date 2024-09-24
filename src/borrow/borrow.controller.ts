import { BadRequestException, Body, Controller, HttpException, NotFoundException, Post } from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { BorrowedBook as BorrowedBookModel } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { BookService } from 'src/book/book.service';

@Controller('borrow')
export class BorrowController {
    constructor(
        private readonly borrowService: BorrowService,
        private readonly userService: UserService,
        private readonly bookService: BookService
    ) {}

    @Post()
    async BorrowBook(
        @Body() reqBody: { userCode: string, bookCode: string }
    ): Promise<BorrowedBookModel> {
        try {
            const { userCode, bookCode } = reqBody
            const user = await this.userService.getUserByCode({ code: userCode })
            const book = await this.bookService.getBookByCode({ code: bookCode })
    
            // check user by code
            if (!user) throw new NotFoundException('user code not found')
            
            // check book by code
            if (!book) throw new NotFoundException('book code not found')

            // check book stock
            if (book.stock < 1) throw new BadRequestException('book unavailable')

            // check maximum borrow user
            const checkUser = await this.borrowService.checkBook({ userId: user.id })
            if (checkUser.length >= 2) throw new BadRequestException('user has exceeded the borrowing limit')
            
            // check book was borrowed by another user
            const checkBook = await this.borrowService.checkBook({ bookId: book.id })
            if (checkBook.length > 0) throw new BadRequestException('book was borrowed by another member')
            
            const borrowBook = await this.borrowService.borrowBook({
                user: { connect: { code: user.code } },
                book: { connect: { code: book.code } }
            })

            // deduct book stock
            await this.bookService.updateBook({ where: { code: book.code }, data: { stock: (book.stock - 1) } })
            
            return borrowBook
        } catch (err) {
            throw new HttpException({
                status: err.status,
                message: err.message
            }, err.status, {
                cause: err
            })
        }
    }
}
