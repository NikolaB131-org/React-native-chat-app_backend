import express from 'express';
import chatsController from '../modules/chats/chats.controller';

const chatsRouter = express.Router();

chatsRouter.route('/:id')
  .get(chatsController.getChat)
  .delete(chatsController.deleteChat)
  .patch(chatsController.updateName)

chatsRouter.post('/join/:id', chatsController.join);
chatsRouter.delete('/leave/:id', chatsController.leave);

export default chatsRouter;
