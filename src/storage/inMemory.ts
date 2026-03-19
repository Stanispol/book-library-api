// src/storage/inMemory.ts
import { randomUUID } from 'crypto';
import { Book, CreateBookDto } from '../types';

export class InMemoryBookStorage {
  private books: Book[] = [];

  getAll(): Book[] {
    return [...this.books]; // возвращаем копию, чтобы никто не мутировал напрямую
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

// Создаём один экземпляр (singleton-подобный подход для простоты)
export const bookStorage = new InMemoryBookStorage();