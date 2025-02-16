import mongoose from 'mongoose';

const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    participants: [String],
    chats: [
      {
        from: String,
        text: String,
        date: Date,
        seen: Boolean,
      },
    ],
  },
  { collection: 'conversation' }, // TODO: should be removed, need to fix mongo model
);

export const Conversation = mongoose.model('Conversation', conversationSchema);
