import { Injectable } from '@nestjs/common';
import { BorrowedBook, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BorrowService {
    constructor(private prisma: PrismaService) {}

    async checkBook(
        BorrowedBookWhereInput: Prisma.BorrowedBookWhereInput
    ): Promise<BorrowedBook[]> {
        return await this.prisma.borrowedBook.findMany({ where: BorrowedBookWhereInput })
    }
    
    async borrowBook(
        data: Prisma.BorrowedBookCreateInput
    ): Promise<BorrowedBook> {
        return await this.prisma.borrowedBook.create({ data })
    }

    async checkStock(
        BorrowedBookWhereInput: Prisma.BorrowedBookWhereInput
    ) {
        return await this.prisma.borrowedBook.count({ where: BorrowedBookWhereInput })
    }
}
