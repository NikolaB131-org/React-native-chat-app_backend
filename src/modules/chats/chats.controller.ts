import { Request, Response, NextFunction } from 'express';
import ApiError from '../../middlewares/error/ApiError';
import chatsService from './chats.service';

const getChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers.authorization?.split(' ')[1];
    const { id } = req.params;
    if (!userId || !id) throw ApiError.badRequest('User id and chat id are required');

    const data = await chatsService.getChat(userId, id);
    res.json(data);
  } catch (err) {
    next(err);
    return;
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers.authorization?.split(' ')[1];
    const name = req.query.name?.toString();
    if (!userId || !name) {
      next(ApiError.badRequest('User id and chat name are required'));
      return;
    }
    const data = await chatsService.create(userId, name);
    res.json(data);
  } catch (err) {
    next(err);
    return;
  }
};

const updateName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers.authorization?.split(' ')[1];
    const { id } = req.params;
    const name = req.query.name?.toString();
    if (!userId || !id || !name) {
      next(ApiError.badRequest('User id, chat id, chat name are required'));
      return;
    }
    await chatsService.updateName(userId, id, name);
    res.sendStatus(200);
  } catch (err) {
    next(err);
    return;
  }
};

const deleteChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers.authorization?.split(' ')[1];
    const { id } = req.params;
    if (!userId || !id) {
      next(ApiError.badRequest('User id and chat id are required'));
      return;
    }
    await chatsService.deleteChat(userId, id);
    res.sendStatus(200);
  } catch (err) {
    next(err);
    return;
  }
};

const search = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers.authorization?.split(' ')[1];
    if (!userId) {
      next(ApiError.badRequest('User id are required'));
      return;
    }
    const text = req.query.text?.toString() ?? '';
    const data = await chatsService.search(userId, text);
    res.json(data);
  } catch (err) {
    next(err);
    return;
  }
};

const join = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers.authorization?.split(' ')[1];
    const { id } = req.params;
    if (!userId || !id) {
      next(ApiError.badRequest('User id and chat id are required'));
      return;
    }
    await chatsService.join(userId, id);
    const data = await chatsService.getChat(userId, id)
    res.json(data);
  } catch (err) {
    next(err);
    return;
  }
};

const leave = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers.authorization?.split(' ')[1];
    const { id } = req.params;
    if (!userId || !id) {
      next(ApiError.badRequest('User id and chat id are required'));
      return;
    }
    await chatsService.leave(userId, id);
    res.sendStatus(200);
  } catch (err) {
    next(err);
    return;
  }
};

export default {
  getChat,
  create,
  updateName,
  deleteChat,
  search,
  join,
  leave,
};
