import { Schema, Types, model } from 'mongoose';
import { IUser } from '../user/user.model';
import { IMessage } from '../message/message.model';

export type IChat = {
  imageUrl: string;
  name: string;
  creatorId: Types.ObjectId;
  users: Types.DocumentArray<IUser>;
  messages: Types.DocumentArray<IMessage>
};

const chatSchema = new Schema<IChat>({
  imageUrl: { type: String, required: true },
  name: { type: String, required: true },
  creatorId: { type: Schema.Types.ObjectId, required: true },
  users: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message', required: true }],
});

const Chat = model<IChat>('Chat', chatSchema);

export default Chat;
