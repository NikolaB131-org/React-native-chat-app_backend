import { Request, Response, NextFunction } from 'express';
import ApiError from './ApiError';

const errorMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(`time: ${new Date().toLocaleString('ru')}\n`, err);

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ errMessage: err.message });
    return;
  }

  res.status(500).json({ errMessage: 'Something went wrong!' });
};

export default errorMiddleware;
