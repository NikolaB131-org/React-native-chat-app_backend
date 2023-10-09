import Chat, { ChatType } from './chats.model';
import User, { UserType } from '../user/user.model';
import ApiError from '../../middlewares/error/ApiError';

// Removes field joinedChats from UserType
type ChatTypeOmittedUsersJoinedChats = Omit<ChatType, 'users'> & { users: Omit<UserType, 'joinedChats'>[] };

export type GetAllChatsResponse = ChatTypeOmittedUsersJoinedChats[];

const getAllChats = async (userId: string): Promise<GetAllChatsResponse> => {
  const user = await User.findById(userId).populate({
    path: 'joinedChats',
    populate: [{ path: 'users', select: '-joinedChats' }, 'messages'],
  });
  if (!user) throw ApiError.notFound('User with this id not found');

  return user.joinedChats.map(chat => chat.toObject());
};

export type GetChatResponse = ChatTypeOmittedUsersJoinedChats;

const getChat = async (userId: string, chatId: string): Promise<GetChatResponse> => {
  const chat = await Chat.findById({ _id: chatId }).populate([
    { path: 'users', select: '-joinedChats' },
    { path: 'messages' },
  ]);
  if (!chat) throw ApiError.notFound('Chat with this id not found');

  const isChatHaveUser = chat.users.some(user => user.id === userId);
  if (!isChatHaveUser) throw ApiError.forbidden('User is not a member of this chat');

  return chat.toObject();
};

const create = async (userId: string, chatName: string): Promise<void> => {
  const user = await User.findById(userId);
  if (!user) return;

  const chat = await Chat.create({ name: chatName, creatorId: user, users: [user] });
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
  getAllChats,
  getChat,
  create,
  deleteChat,
  join,
  leave,
};
