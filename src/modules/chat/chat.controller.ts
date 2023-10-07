import { Request, Response, NextFunction } from 'express';
import ApiError from '../../middlewares/error/ApiError';
import chatService from './chat.service';

const getInfo = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  if (!id) {
    next(ApiError.badRequest('Chat id required'));
    return;
  }
  const info = await chatService.getInfo(id);
  res.json(info);
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.body;
  const name = req.query.name?.toString();
  if (!username || !name) {
    next(ApiError.badRequest('Username and chat name are required'));
    return;
  }
  await chatService.create(username, name);
  res.sendStatus(200);
};

const deleteChat = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.body;
  const { id } = req.params;
  if (!username || !id) {
    next(ApiError.badRequest('Username and chat id are required'));
    return;
  }
  await chatService.deleteChat(username, id);
  res.sendStatus(200);
};

const join = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.body;
  const { id } = req.params;
  if (!username || !id) {
    next(ApiError.badRequest('Username and chat id are required'));
    return;
  }
  await chatService.join(username, id);
  res.sendStatus(200);
};

const leave = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.body;
  const { id } = req.params;
  if (!username || !id) {
    next(ApiError.badRequest('Username and chat id are required'));
    return;
  }
  await chatService.leave(username, id);
  res.sendStatus(200);
};

export default {
  getInfo,
  create,
  deleteChat,
  join,
  leave,
};
