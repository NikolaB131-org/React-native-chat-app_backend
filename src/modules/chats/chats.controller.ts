import { Request, Response, NextFunction } from 'express';
import ApiError from '../../middlewares/error/ApiError';
import chatsService from './chats.service';

const getChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers['user-id'] as string;
    const { id } = req.params;
    if (!id) throw ApiError.badRequest('Chat id are required');

    const data = await chatsService.getChat(userId, id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers['user-id'] as string;
    const name = req.query.name?.toString();
    if (!name) {
      next(ApiError.badRequest('Chat name are required'));
      return;
    }
    const data = await chatsService.create(userId, name);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const updateName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers['user-id'] as string;
    const { id } = req.params;
    const name = req.query.name?.toString();
    if (!id || !name) {
      next(ApiError.badRequest('Chat id and chat name are required'));
      return;
    }
    await chatsService.updateName(userId, id, name);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

const deleteChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers['user-id'] as string;
    const { id } = req.params;
    if (!id) {
      next(ApiError.badRequest('Chat id are required'));
      return;
    }
    await chatsService.deleteChat(userId, id);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

const search = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers['user-id'] as string;
    const text = req.query.text?.toString() ?? '';
    const data = await chatsService.search(userId, text);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const join = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers['user-id'] as string;
    const { id } = req.params;
    if (!id) {
      next(ApiError.badRequest('Chat id are required'));
      return;
    }
    await chatsService.join(userId, id);
    const data = await chatsService.getChat(userId, id)
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const leave = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers['user-id'] as string;
    const { id } = req.params;
    if (!id) {
      next(ApiError.badRequest('Chat id are required'));
      return;
    }
    await chatsService.leave(userId, id);
    res.sendStatus(200);
  } catch (err) {
    next(err);
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
