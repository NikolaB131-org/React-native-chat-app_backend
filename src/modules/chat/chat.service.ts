import User from '../user/user.model';
import Chat from './chat.model';

const getInfo = async (id: string) => {
  const chat = await Chat.findById(id).select('-_id -__v');
  if (!chat) return;

  return chat.populate({ path: 'users', select: '_id username' });
};

const create = async (username: string, chatName: string) => {
  const user = await User.findOne({ username });
  if (!user) return;

  const chat = await Chat.create({ imageUrl: 'image.url', name: chatName, creatorId: user, users: [user] });
  user.joinedChats.addToSet(chat);
  await user.save();
};

const deleteChat = async (username: string, chatId: string) => {
  const user = await User.findOne({ username });
  const chat = await Chat.findById(chatId);
  if (!user || !chat || !chat.creatorId.equals(user._id)) return;

  user.joinedChats.remove(chat);
  await user.save();
  await Chat.deleteOne({ _id: chat });
};

const join = async (username: string, chatId: string) => {
  const user = await User.findOne({ username });
  const chat = await Chat.findById(chatId);
  if (!user || !chat) return;

  user.joinedChats.addToSet(chat);
  await user.save();
  chat.users.addToSet(user);
  await chat.save();
};

const leave = async (username: string, chatId: string) => {
  const user = await User.findOne({ username });
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
