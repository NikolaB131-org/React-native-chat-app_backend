import { Request, Response, NextFunction } from 'express';
import ApiError from '../../middlewares/error/ApiError';
import authService from './auth.service';

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) throw ApiError.badRequest('Username and password are required');

    res.json({ userId: await authService.login(username, password) });
  } catch (err) {
    next(err);
    return;
  }
};

export default {
  login,
};
