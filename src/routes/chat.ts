import express from 'express';
import chatController from '../modules/chat/chat.controller';

const chatRouter = express.Router();

chatRouter.route('/:id')
  .get(chatController.getInfo)
  .delete(chatController.deleteChat)

chatRouter.post('/create', chatController.create);

chatRouter.post('/join/:id', chatController.join);
chatRouter.delete('/leave/:id', chatController.leave);

export default chatRouter;
