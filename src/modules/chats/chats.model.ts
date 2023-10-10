import { Schema, Types, model } from 'mongoose';
import { UserSchema, UserType } from '../user/user.model';
import { MessageSchema, MessageType } from '../message/message.model';

export type ChatType = {
  id: string;
  imageUrl?: string;
  name: string;
  creatorId: string;
  users: UserType[];
  messages: MessageType[];
};

export type ChatSchema = {
  imageUrl?: string;
  name: string;
  creatorId: Types.ObjectId;
  users: Types.DocumentArray<UserSchema>;
  messages: Types.DocumentArray<MessageSchema>;
};

const chatSchema = new Schema<ChatSchema>(
  {
    imageUrl: String,
    name: { type: String, required: true },
    creatorId: { type: Schema.Types.ObjectId, required: true },
    users: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message', required: true }],
  },
  {
    toObject: {
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
      },
      virtuals: true,
    },
  },
);

chatSchema.index({ name: 'text' });

const Chat = model<ChatSchema>('Chat', chatSchema);

export default Chat;
