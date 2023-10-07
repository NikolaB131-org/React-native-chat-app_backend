import { Schema, Types, model } from 'mongoose';
import { IChat } from '../chat/chat.model';

export type IUser = {
  username: string;
  joinedChats: Types.DocumentArray<IChat>;
};

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  joinedChats: [{ type: Schema.Types.ObjectId, ref: 'Chat' }],
});

export default model<IUser>('User', userSchema);
