import { Schema, Types, model } from 'mongoose';

export type MessageType = {
  id: string;
  message: string;
  senderId: string;
  createdAt: Date;
};

export type MessageSchema = {
  message: string;
  senderId: Types.ObjectId;
  createdAt: Date;
};

const messageSchema = new Schema<MessageSchema>(
  {
    message: { type: String, required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toObject: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

const Message = model<MessageSchema>('Message', messageSchema);

export default Message;
