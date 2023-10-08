import { Schema, Types, model } from 'mongoose';

export type IMessage = {
  message: string;
  senderId: Types.ObjectId;
  createdAt: Date;
};

const messageSchema = new Schema<IMessage>(
  {
    message: { type: String, required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const Message = model<IMessage>("Message", messageSchema);

export default Message;
