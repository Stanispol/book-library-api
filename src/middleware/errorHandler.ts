// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Если заголовки уже отправлены — передаём дальше (редкий случай)
  if (res.headersSent) {
    return next(err);
  }

  const requestId = req.requestId || 'unknown';

  // Определяем, что это уже наш кастомный объект ошибки
  if (err && typeof err === 'object' && 'code' in err && 'message' in err) {
    const typedError = err as ErrorResponse & { status?: number };

    const status = typedError.status || 500;
    const response: ErrorResponse = {
      error: true,
      code: typedError.code || 'INTERNAL_SERVER_ERROR',
      message: typedError.message || 'Внутренняя ошибка сервера',
      requestId,
    };

    res.status(status).json(response);
    return;
  }

  // Если обычная ошибка (throw new Error(...))
  const status = 500;
  const message = err?.message || 'Неизвестная ошибка';

  const response: ErrorResponse = {
    error: true,
    code: 'INTERNAL_SERVER_ERROR',
    message,
    requestId,
  };

  console.error(`[${requestId}] Error:`, err); // логируем полную ошибку в консоль

  res.status(status).json(response);
}