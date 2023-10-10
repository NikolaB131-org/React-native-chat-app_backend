import { Schema, Types, model } from 'mongoose';
import { ChatSchema, ChatType } from '../chats/chats.model';

export type UserType = {
  id: string;
  username: string;
  joinedChats: ChatType[];
};

export type UserSchema = {
  username: string;
  joinedChats: Types.DocumentArray<ChatSchema>;
};

const userSchema = new Schema<UserSchema>(
  {
    username: { type: String, required: true },
    joinedChats: [{ type: Schema.Types.ObjectId, ref: 'Chat', required: true }],
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

const User = model<UserSchema>('User', userSchema);

export default User;
