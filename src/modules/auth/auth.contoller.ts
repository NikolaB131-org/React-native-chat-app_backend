import { Request, Response, NextFunction } from 'express';
import ApiError from '../../middlewares/error/ApiError';
import authService from './auth.service';

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.body;
  if (!username) {
    next(ApiError.badRequest('Username required'));
    return;
  }
  await authService.login(username);
  res.sendStatus(200);
};

export default {
  login,
};
