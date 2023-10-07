import { Schema, Types, model } from 'mongoose';
import { IUser } from '../user/user.model';

export type IChat = {
  imageUrl: string;
  name: string;
  creatorId: Types.ObjectId;
  users: Types.DocumentArray<IUser>;
};

const chatSchema = new Schema<IChat>({
  imageUrl: { type: String, required: true },
  name: { type: String, required: true },
  creatorId: { type: Schema.Types.ObjectId, required: true },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

export default model<IChat>('Chat', chatSchema);
