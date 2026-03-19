// src/middleware/requestId.ts
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

// Добавляем requestId в каждый запрос
export function attachRequestId(req: Request, res: Response, next: NextFunction) {
  const requestId = randomUUID();
  req['requestId'] = requestId; // расширяем объект req (TypeScript позволит благодаря @types/express)

  // Можно сразу добавить в заголовки ответа (удобно для отладки)
  res.setHeader('X-Request-ID', requestId);

  next();
}