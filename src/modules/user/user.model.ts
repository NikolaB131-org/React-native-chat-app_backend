import { Schema, Types, model } from 'mongoose';
import { IChat } from '../chat/chat.model';

export type IUser = {
  username: string;
  joinedChats: Types.DocumentArray<IChat>;
};

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  joinedChats: [{ type: Schema.Types.ObjectId, ref: 'Chat', required: true }],
});

const User = model<IUser>('User', userSchema);

export default User;
