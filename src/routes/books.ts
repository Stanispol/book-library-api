// src/routes/books.ts
import { Router, Request, Response, NextFunction } from 'express';
import { bookStorage } from '../storage/inMemory';
import { CreateBookDto, Book, ErrorResponse } from '../types';

const router = Router();

// Вспомогательная функция валидации
function validateCreateBookDto(dto: any): string | null {
  if (!dto || typeof dto !== 'object') {
    return 'Тело запроса должно быть объектом JSON';
  }

  if (typeof dto.title !== 'string' || dto.title.trim().length < 3) {
    return 'Поле title обязательно и должно содержать минимум 3 символа (без пробелов по краям)';
  }

  if (typeof dto.price !== 'number' || isNaN(dto.price) || dto.price < 0) {
    return 'Поле price обязательно должно быть числом ≥ 0';
  }

  // Можно добавить другие поля опционально, но пока только эти два правила

  return null; // всё ок
}

// GET /api/items — список всех книг
router.get('/', (req: Request, res: Response) => {
  const books = bookStorage.getAll();

  res.json({
    success: true,
    data: books,
    requestId: req.requestId,
  });
});

// GET /api/items/:id — одна книга
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as string;
  const book = bookStorage.getById(id);

  if (!book) {
    const err: any = new Error(`Книга с id ${id} не найдена`);
    err.code = 'NOT_FOUND';
    err.status = 404;
    return next(err);
  }

  res.json({
    success: true,
    data: book,
    requestId: req.requestId,
  });
});

// POST /api/items — создание книги
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  const dto: CreateBookDto = req.body;

  const validationError = validateCreateBookDto(dto);
  if (validationError) {
    const err: any = new Error(validationError);
    err.code = 'VALIDATION_ERROR';
    err.status = 400;
    return next(err);
  }

  try {
    const newBook = bookStorage.create(dto);

    res.status(201).json({
      success: true,
      data: newBook,
      requestId: req.requestId,
    });
  } catch (err) {
    next(err); // если что-то сломалось внутри storage (маловероятно, но на будущее)
  }
});

export default router;