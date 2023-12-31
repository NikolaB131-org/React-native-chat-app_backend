import { Schema, Types, model } from 'mongoose';
import { UserType } from '../user/user.model';

export type MessageType = {
  id: string;
  message: string;
  sender: UserType;
  createdAt: string;
};

export type MessageSchema = {
  message: string;
  sender: Types.ObjectId;
  createdAt: Date;
};

const messageSchema = new Schema<MessageSchema>(
  {
    message: { type: String, required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toObject: {
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
      },
      virtuals: true,
    },
  },
);

const Message = model<MessageSchema>('Message', messageSchema);

export default Message;
