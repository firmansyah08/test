import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { BookService } from './book.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('book')
export class BookController {
    constructor(
        private readonly bookService: BookService
    ) {}

    @ApiTags('Book')
    @Get('/')
    async GetBook(
        @Res() res
    ) {
        const books = await this.bookService.getBook()

        return res.status(HttpStatus.OK).json({
            status: 'success',
            message: 'success get list book',
            data: books
        })
    }

    @ApiTags('Book')
    @Get('/:id')
    async GetBookByCode(
        @Res() res,
        @Param('id') id: string
    ) {
        const book = await this.bookService.getBookByCode({ code: id })

        return res.status(HttpStatus.OK).json({
            status: 'success',
            message: 'success get detail book',
            data: book
        })
    }
}
