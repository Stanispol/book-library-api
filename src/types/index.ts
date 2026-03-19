// src/types/index.ts

export interface Book {
  id: string;
  title: string;
  price: number;
  author?: string;
  description?: string;
  createdAt: Date;
}

export interface CreateBookDto {
  title: string;
  price: number;
  author?: string;
  description?: string;
}

// Единый формат ошибки (как в твоей схеме — все ошибки в одном виде)
export interface ErrorResponse {
  error: boolean;
  code: string;           // например: "VALIDATION_ERROR", "NOT_FOUND", "BAD_REQUEST"
  message: string;
  requestId: string;
}

// Для удобства — тип успешного ответа со списком или одной книгой
export type ApiResponse<T> = 
  | { success: true; data: T; requestId: string }
  | ErrorResponse;