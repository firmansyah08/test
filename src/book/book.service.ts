import { Injectable } from '@nestjs/common';
import { Book, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BookService {
    constructor(private prisma: PrismaService) {}

    async getBook(): Promise<Book[]> {
        return this.prisma.book.findMany()
    }

    async getBookByCode(
        bookWhereUniqueInput: Prisma.BookWhereUniqueInput,
    ): Promise<Book | null> {
        return this.prisma.book.findUnique({ where: bookWhereUniqueInput })
    }

    async updateBook(params: {
        where: Prisma.BookWhereUniqueInput,
        data: Prisma.BookUpdateInput
    }): Promise<Book> {
        const { where, data } = params

        return this.prisma.book.update({
            data, where
        })
    }
}
