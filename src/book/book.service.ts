import { Injectable } from '@nestjs/common';
import { Book, BorrowedBook, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { ResponseDto } from './book.dto';
import { BorrowService } from 'src/borrow/borrow.service';

@Injectable()
export class BookService {
    constructor(
        private prisma: PrismaService,
        private readonly borrowService: BorrowService
    ) {}

    async getBook(): Promise<ResponseDto[]> {
        let books = await this.prisma.book.findMany()

        let response = []
        for (let book of books) {
            let res = new ResponseDto()
            res = {...book, ...res}

            const borrowedBook = await this.borrowService.checkStock({ bookId: book.id, returnedDate: null })
            res.available = (book.stock - borrowedBook)

            response.push(res)
        }
        
        return response
    }

    async getBookByCode(
        bookWhereUniqueInput: Prisma.BookWhereUniqueInput,
    ): Promise<Book | null> {
        return await this.prisma.book.findUnique({ where: bookWhereUniqueInput })
    }

    async updateBook(params: {
        where: Prisma.BookWhereUniqueInput,
        data: Prisma.BookUpdateInput
    }): Promise<Book> {
        const { where, data } = params

        return await this.prisma.book.update({ data, where })
    }
}
