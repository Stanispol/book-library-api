// src/middleware/logger.ts
import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const requestId = req.requestId || 'unknown';

  // Запоминаем оригинальный res.send / res.json, чтобы перехватить статус
  const originalJson = res.json;
  const originalSend = res.send;

  // Флаги, чтобы не логировать дважды (на случай вызова send/json несколько раз)
  let logged = false;

  const log = (statusCode: number) => {
    if (logged) return;
    logged = true;

    const duration = Date.now() - start;
    const now = new Date().toISOString();

    console.log(
      `[${now}] ${req.method} ${req.originalUrl} ${statusCode} ${duration}ms ` +
      `reqId: ${requestId}`
    );
  };

  // Перехватываем res.json
  res.json = function (body) {
    const result = originalJson.call(this, body);
    log(res.statusCode);
    return result;
  };

  // Перехватываем res.send (на случай, если кто-то использует send вместо json)
  res.send = function (body) {
    const result = originalSend.call(this, body);
    log(res.statusCode);
    return result;
  };

  // На случай, если ответ завершился без вызова send/json (редко, но бывает)
  res.on('finish', () => {
    log(res.statusCode);
  });

  next();
}