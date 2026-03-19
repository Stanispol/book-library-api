// src/app.ts
import express from 'express';
import { attachRequestId } from './middleware/requestId';
import { requestLogger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import booksRouter from './routes/books';   // ← подключаем
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';  // или путь к твоему файлу

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(attachRequestId);
app.use(requestLogger);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Используем роутер для /api/items
app.use('/api/items', booksRouter);

// Тестовые роуты (можно потом убрать)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Библиотека книг работает',
    requestId: req.requestId,
  });
});

app.get('/test-error', (req, res, next) => {
  const err: any = new Error('Тестовая ошибка');
  err.code = 'TEST_ERROR';
  err.status = 418;
  next(err);
});

// error handler — всегда последним
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен → http://localhost:${PORT}`);
  console.log(`Health check:          http://localhost:${PORT}/health`);
  console.log(`API endpoints:         http://localhost:${PORT}/api/items`);
  console.log(`Swagger UI (документация + тесты): http://localhost:${PORT}/api-docs`);
});