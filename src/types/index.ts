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


export interface ErrorResponse {
  error: boolean;
  code: string;          
  message: string;
  requestId: string;
}


export type ApiResponse<T> = 
  | { success: true; data: T; requestId: string }
  | ErrorResponse;