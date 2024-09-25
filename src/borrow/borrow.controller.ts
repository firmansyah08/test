import { BadRequestException, Body, Controller, HttpException, HttpStatus, NotFoundException, Post, Res } from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { UserService } from 'src/user/user.service';
import { BookService } from 'src/book/book.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('borrow')
export class BorrowController {
    constructor(
        private readonly borrowService: BorrowService,
        private readonly userService: UserService,
        private readonly bookService: BookService
    ) {}

    @ApiTags('Borrow Book')
    @Post()
    async BorrowBook(
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

            // check book stock
            const checkStock = await this.borrowService.checkStock({ bookId: book.id, returnedDate: null })
            const stock = book.stock - checkStock
            if (stock < 1) throw new BadRequestException('book unavailable')

            // check if user have penalty
            await this.userService.checkPenalty({ user })

            // check maximum borrow user
            const checkUser = await this.borrowService.checkBook({ userId: user.id, returnedDate: null })
            if (checkUser.length >= 2) throw new BadRequestException('user has exceeded the borrowing limit')
            
            // check book was borrowed by another user
            const checkBook = await this.borrowService.checkBook({ bookId: book.id, returnedDate: null })
            if (checkBook.length > 0) throw new BadRequestException('book was borrowed by another member')
            
            await this.borrowService.borrowBook({
                user: { connect: { code: user.code } },
                book: { connect: { code: book.code } }
            })
            
            return res.status(HttpStatus.OK).json({
                status: 'success',
                message: 'success borrow book',
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
