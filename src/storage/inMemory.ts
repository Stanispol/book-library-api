import { randomUUID } from 'crypto';
import { Book, CreateBookDto } from '../types';

export class InMemoryBookStorage {
  private books: Book[] = [];

  getAll(): Book[] {
    return [...this.books]; 
  }

  getById(id: string): Book | undefined {
    return this.books.find(book => book.id === id);
  }

  create(dto: CreateBookDto): Book {
    const newBook: Book = {
      id: randomUUID(),
      ...dto,
      createdAt: new Date(),
    };
    this.books.push(newBook);
    return newBook;
  }
}

export const bookStorage = new InMemoryBookStorage();