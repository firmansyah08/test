import { Controller, Get, Param } from '@nestjs/common';
import { BookService } from './book.service';
import { Book as BookModel } from '@prisma/client';

@Controller('book')
export class BookController {
    constructor(
        private readonly bookService: BookService
    ) {}

    @Get()
    async GetBook(): Promise<BookModel[]> {
        return this.bookService.getBook()
    }

    @Get('/:id')
    async GetBookByCode(@Param('id') id: string): Promise<BookModel> {
        return this.bookService.getBookByCode({ code: id })
    }
}
