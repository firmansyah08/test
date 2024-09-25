import { Book } from "@prisma/client";

export class ResponseDto implements Book {
    id: number
    code: string
    title: string
    author: string
    stock: number
    available: number
}