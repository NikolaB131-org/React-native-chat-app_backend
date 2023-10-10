import Chat, { ChatType } from './chats.model';
import User from '../user/user.model';
import ApiError from '../../middlewares/error/ApiError';

export type GetAllChatsResponse = ChatType[];

const getAllChats = async (userId: string): Promise<GetAllChatsResponse> => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User with this id not found');

  return (
    await user.populate({
      path: 'joinedChats',
      populate: [
        { path: 'users', select: '-joinedChats' },
        { path: 'messages', populate: { path: 'sender', select: '-joinedChats' } },
      ],
    })
  ).joinedChats.map(chat => chat.toObject());
};

export type GetChatResponse = ChatType;

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

const create = async (userId: string, chatName: string): Promise<ChatType> => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User with this id not found');

  const chat = await Chat.create({ name: chatName, creatorId: user, users: [user] });
  user.joinedChats.addToSet(chat);
  await user.save();
  return chat.toObject();
};

const updateName = async (userId: string, chatId: string, name: string): Promise<void> => {
  const chat = await Chat.findById(chatId);
  if (!chat) throw ApiError.notFound('Chat with this id not found');

  if (!chat.creatorId.equals(userId)) throw ApiError.forbidden('User is not a creator of this chat');

  await chat.updateOne({ name });
};

const deleteChat = async (userId: string, chatId: string): Promise<void> => {
  const user = await User.findById(userId);
  const chat = await Chat.findById(chatId);
  if (!user || !chat) return;
  if (!chat.creatorId.equals(user._id)) throw ApiError.forbidden('User is not a creator of this chat');

  user.joinedChats.remove(chat);
  await user.save();
  await Chat.deleteOne({ _id: chat });
};

export type ChatsSearchResponse = Pick<ChatType, 'id' | 'imageUrl' | 'name' | 'users'>[];

const search = async (userId: string, text: string): Promise<ChatsSearchResponse[]> => {
  const joinedChatsIds = (await User.findById(userId).populate('joinedChats'))?.joinedChats.map(chat => chat.id);
  return (
    await Chat.find({ $and: [{ _id: { $nin: joinedChatsIds } }, { name: { $regex: text, $options: 'i' } }] })
      .limit(100)
      .select('name imageUrl users')
  ).map(chat => chat.toObject());
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
  updateName,
  deleteChat,
  search,
  join,
  leave,
};
