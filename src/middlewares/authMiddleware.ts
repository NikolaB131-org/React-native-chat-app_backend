import { Request, Response, NextFunction } from 'express';
import ApiError from './error/ApiError';
import { verifyAccessToken } from '../utils/token';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error();
    }

    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      throw new Error();
    }

    req.headers['user-id'] = verifyAccessToken(accessToken).userId;
    next();
  } catch (err) {
    next(ApiError.unauthorized());
  }
};

export default authMiddleware;
