import Chat, { ChatType } from './chat.model';
import User, { UserType } from '../user/user.model';
import ApiError from '../../middlewares/error/ApiError';

// Removes field joinedChats from UserType
type GetInfoResponse = Omit<ChatType, 'users'> & { users: Omit<UserType, 'joinedChats'>[] };

const getInfo = async (userId: string, chatId: string): Promise<GetInfoResponse> => {
  const chat = await Chat.findById({ _id: chatId }).populate([
    { path: 'users', select: '_id username' },
    { path: 'messages' },
  ]);
  if (!chat) throw ApiError.notFound('Chat with this id not found');

  const isChatHaveUser = chat.users.some(user => user.id === userId);
  if (!isChatHaveUser) throw ApiError.unauthorized('User is not a member of this chat');

  return chat.toObject();
};

const create = async (userId: string, chatName: string): Promise<void> => {
  const user = await User.findById(userId);
  if (!user) return;

  const chat = await Chat.create({ imageUrl: 'image.url', name: chatName, creatorId: user, users: [user] });
  user.joinedChats.addToSet(chat);
  await user.save();
};

const deleteChat = async (userId: string, chatId: string): Promise<void> => {
  const user = await User.findById(userId);
  const chat = await Chat.findById(chatId);
  if (!user || !chat || !chat.creatorId.equals(user._id)) return;

  user.joinedChats.remove(chat);
  await user.save();
  await Chat.deleteOne({ _id: chat });
};

const join = async (userId: string, chatId: string): Promise<void> => {
  const user = await User.findById(userId);
  const chat = await Chat.findById(chatId);
  if (!user || !chat) return;

  user.joinedChats.addToSet(chat);
  await user.save();
  chat.users.addToSet(user);
  await chat.save();
};

const leave = async (userId: string, chatId: string): Promise<void> => {
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
