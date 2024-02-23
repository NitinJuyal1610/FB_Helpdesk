import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    pageId: String,
    senderId: String,
    messages: [
      {
        timestamp: Date,
        messageId: String,
        message: String,
        senderId: String,
        recipientId: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.models['Conversation'] ||
  mongoose.model('Conversation', conversationSchema);
