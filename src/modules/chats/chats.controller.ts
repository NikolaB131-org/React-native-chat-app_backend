import { Request, Response, NextFunction } from 'express';
import ApiError from '../../middlewares/error/ApiError';
import chatsService from './chats.service';

const getChat = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers.authorization?.split(' ')[1];
  const { id } = req.params;
  try {
    if (!userId || !id) throw ApiError.badRequest('User id and chat id are required');

    const data = await chatsService.getChat(userId, id);
    res.json(data);
  } catch (err) {
    next(err);
    return;
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers.authorization?.split(' ')[1];
  const name = req.query.name?.toString();
  if (!userId || !name) {
    next(ApiError.badRequest('User id and chat name are required'));
    return;
  }
  await chatsService.create(userId, name);
  res.sendStatus(200);
};

const deleteChat = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers.authorization?.split(' ')[1];
  const { id } = req.params;
  if (!userId || !id) {
    next(ApiError.badRequest('User id and chat id are required'));
    return;
  }
  await chatsService.deleteChat(userId, id);
  res.sendStatus(200);
};

const join = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers.authorization?.split(' ')[1];
  const { id } = req.params;
  if (!userId || !id) {
    next(ApiError.badRequest('User id and chat id are required'));
    return;
  }
  await chatsService.join(userId, id);
  res.sendStatus(200);
};

const leave = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers.authorization?.split(' ')[1];
  const { id } = req.params;
  if (!userId || !id) {
    next(ApiError.badRequest('User id and chat id are required'));
    return;
  }
  await chatsService.leave(userId, id);
  res.sendStatus(200);
};

export default {
  getChat,
  create,
  deleteChat,
  join,
  leave,
};
