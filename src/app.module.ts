import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { BookController } from './book/book.controller';
import { BookService } from './book/book.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { BorrowController } from './borrow/borrow.controller';
import { BorrowService } from './borrow/borrow.service';

@Module({
  imports: [],
  controllers: [AppController, UserController, BookController, BorrowController],
  providers: [AppService, UserService, PrismaService, BookService, BorrowService],
})
export class AppModule {}
