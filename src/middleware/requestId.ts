import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';


export function attachRequestId(req: Request, res: Response, next: NextFunction) {
  const requestId = randomUUID();
  req['requestId'] = requestId; 


  res.setHeader('X-Request-ID', requestId);

  next();
}