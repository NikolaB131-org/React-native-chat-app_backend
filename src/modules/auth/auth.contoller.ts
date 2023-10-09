import { Request, Response, NextFunction } from 'express';
import ApiError from '../../middlewares/error/ApiError';
import authService from './auth.service';

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.body;
    if (!username) throw ApiError.badRequest('Username required');

    res.json({ userId: await authService.login(username) });
  } catch (err) {
    next(err);
    return;
  }
};

export default {
  login,
};
