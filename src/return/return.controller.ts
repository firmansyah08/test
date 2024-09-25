import { Body, Controller, HttpException, HttpStatus, NotFoundException, Post, Res } from '@nestjs/common';
import { BookService } from 'src/book/book.service';
import { BorrowService } from 'src/borrow/borrow.service';
import { UserService } from 'src/user/user.service';
import { ReturnService } from './return.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('return')
export class ReturnController {
    constructor(
        private readonly userService: UserService,
        private readonly bookService: BookService,
        private readonly borrowService: BorrowService,
        private readonly returnService: ReturnService
    ) {}

    @ApiTags('Return Book')
    @Post()
    async ReturnBook(
        @Res() res,
        @Body() reqBody: { userCode: string, bookCode: string }
    ) {
        try {
            const { userCode, bookCode } = reqBody
            
            // check user by code
            const user = await this.userService.getUserByCode({ code: userCode })
            if (!user) throw new NotFoundException('user code not found')
            
            // check book by code
            const book = await this.bookService.getBookByCode({ code: bookCode })
            if (!book) throw new NotFoundException('book code not found')

            // check borrowed book
            const borrowedBook = await this.borrowService.checkBook({ userId: user.id, bookId: book.id, returnedDate: null })
            if (borrowedBook.length < 1) throw new NotFoundException('data user and book not found')
            
            // return book
            await this.returnService.returnBook({ data: borrowedBook[0] })
            
            return res.status(HttpStatus.OK).json({
                status: 'success',
                message: 'success return book',
                data: {}
            })
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
