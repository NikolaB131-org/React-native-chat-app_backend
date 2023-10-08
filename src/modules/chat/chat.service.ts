import User from '../user/user.model';
import Chat from './chat.model';

const getInfo = async (id: string) => {
  const chat = await Chat.findById(id).select('-_id -__v');
  if (!chat) return;

  return chat.populate({ path: 'users', select: '_id username' });
};

const create = async (userId: string, chatName: string) => {
  const user = await User.findById(userId)
  if (!user) return;

  const chat = await Chat.create({ imageUrl: 'image.url', name: chatName, creatorId: user, users: [user] });
  user.joinedChats.addToSet(chat);
  await user.save();
};

const deleteChat = async (userId: string, chatId: string) => {
  const user = await User.findById(userId);
  const chat = await Chat.findById(chatId);
  if (!user || !chat || !chat.creatorId.equals(user._id)) return;

  user.joinedChats.remove(chat);
  await user.save();
  await Chat.deleteOne({ _id: chat });
};

const join = async (userId: string, chatId: string) => {
  const user = await User.findById(userId);
  const chat = await Chat.findById(chatId);
  if (!user || !chat) return;

  user.joinedChats.addToSet(chat);
  await user.save();
  chat.users.addToSet(user);
  await chat.save();
};

const leave = async (userId: string, chatId: string) => {
  const user = await User.findById(userId);
  const chat = await Chat.findById(chatId);
  if (!user || !chat) return;

  user.joinedChats.remove(chat);
  await user.save();
  chat.users.remove(user);
  await chat.save();
};

export default {
  getInfo,
  create,
  deleteChat,
  join,
  leave,
};
