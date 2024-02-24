import axios from 'axios';
import connectDB from './connectDB';
import Conversation from '@/models/Conversations';

import Pusher from 'pusher';
const pusher = new Pusher({
  appId: '1761410',
  key: '67ba1292813492d9a757',
  secret: 'face1cd2d7a384d0d5b8',
  cluster: 'ap2',
  useTLS: true,
});

export const handleMessage = async (
  senderId,
  recipientId,
  timestamp,
  message,
) => {
  await connectDB();

  const conversation = await Conversation.findOne({
    senderId,
  });

  if (!conversation) {
    await Conversation.create({
      pageId: recipientId,
      senderId,
      messages: [
        {
          timestamp,
          messageId: message.mid,
          message: message.text,
          senderId,
          recipientId,
        },
      ],
    });
  }

  conversation.messages.push({
    timestamp,
    messageId: message.mid,
    message: message.text,
    senderId,
    recipientId,
  });

  await pusher.trigger('webhook', 'message', {
    timestamp,
    messageId: message.mid,
    message: message.text,
    senderId,
    recipientId,
  });
  await conversation.save();
};

export const sendMessage = async (
  recipientId,
  pageId,
  message,
  access_token,
) => {
  await connectDB();

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `https://graph.facebook.com/v19.0/${pageId}/messages?recipient={id:${recipientId}}&message={text:'${message}'}&messaging_type=RESPONSE&access_token=${access_token}`,
    headers: {
      Cookie: 'ps_l=0; ps_n=0',
    },
  };

  const response = await axios.post(config.url, config);
  const conversation = await Conversation.findOne({
    pageId,
  });

  conversation.messages.push({
    timestamp: Date.now(),
    messageId: response.data.message_id,
    message,
    senderId: pageId,
    recipientId,
  });

  await conversation.save();
};
