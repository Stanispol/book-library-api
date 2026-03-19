import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const requestId = req.requestId || 'unknown';

 
  const originalJson = res.json;
  const originalSend = res.send;

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


  res.json = function (body) {
    const result = originalJson.call(this, body);
    log(res.statusCode);
    return result;
  };


  res.send = function (body) {
    const result = originalSend.call(this, body);
    log(res.statusCode);
    return result;
  };


  res.on('finish', () => {
    log(res.statusCode);
  });

  next();
}