import express from 'express';
import { attachRequestId } from './middleware/requestId';
import { requestLogger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import booksRouter from './routes/books';  
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';  

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(attachRequestId);
app.use(requestLogger);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use('/api/items', booksRouter);


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

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен → http://localhost:${PORT}`);
  console.log(`Swagger UI (документация + тесты): http://localhost:${PORT}/api-docs`);
});