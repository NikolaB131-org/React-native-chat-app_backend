import { GetAllChatsResponse } from '../../modules/chats/chats.service';
import { Document, Types } from 'mongoose';
import { UserSchema } from '../../modules/user/user.model';
import { MessageType } from '../../modules/message/message.model';

export type UserDocument =
  | Document<unknown, {}, UserSchema> &
      UserSchema & {
        _id: Types.ObjectId;
      };

export type WSServerAuthEvent = {
  event: 'auth';
  token: string;
};

export type WSServerSendMessageEvent = {
  event: 'send_message';
  chatId: string;
  message: string;
};

export type WSServerAllEvents = WSServerAuthEvent | WSServerSendMessageEvent;

export type WSClientAllChatsEvent = {
  event: 'all_chats';
  chats: GetAllChatsResponse;
};

export type WSClientReceiveMessageEvent = Omit<MessageType, 'joinedChats'> & {
  event: 'receive_message';
  chatId: string;
};

export type WSClientAllEvents = WSClientAllChatsEvent | WSClientReceiveMessageEvent;
