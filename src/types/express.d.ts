// src/types/express.d.ts
import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    requestId?: string;   // делаем опциональным, чтобы не ломать другие места
  }
}