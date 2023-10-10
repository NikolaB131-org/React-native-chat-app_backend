import express from 'express';
import chatsController from '../modules/chats/chats.controller';

const chatsRouter = express.Router();

chatsRouter.post('/join/:id', chatsController.join);
chatsRouter.delete('/leave/:id', chatsController.leave);

chatsRouter.get('/search', chatsController.search);

chatsRouter.route('/:id')
  .get(chatsController.getChat)
  .delete(chatsController.deleteChat)
  .patch(chatsController.updateName)

chatsRouter.post('/', chatsController.create);

export default chatsRouter;
