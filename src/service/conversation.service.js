import mongoose from 'mongoose';
import { Conversation } from '../model/conversation.model.js';

export const getChatListAndLastChatForUser = async (username) => {
  const chats = await Conversation.find({ participants: { $all: [username] } }, { chats: { $slice: -1 } });
  return chats;
};

export const getChatByUsernameForUser = async (sender, receiver) => {
  let chats = await Conversation.findOne({
    participants: {
      $size: 2,
      $all: [sender, receiver],
    },
  });
  if (!chats || chats.length === 0) {
    chats = await Conversation.create({
      participants: [sender, receiver],
      chats: [],
    });
  }
  return chats;
};

/* IMPORTANT: This must be used when conversation exists
   To initiate conversation use `sendMessage` */
export const sendChat = async (sender, receiver, text) => {
  let chats = await Conversation.updateOne(
    { participants: { $size: 2, $all: [sender, receiver] } },
    {
      $push: {
        chats: {
          from: sender,
          text: text,
          date: new Date(),
          seen: false,
        },
      },
    },
    { upsert: true },
  );
  if (chats.length === 0) {
    chats = await Conversation.create({
      participants: [sender, receiver],
      chats: [],
    });
  }
  return chats;
};

/* IMPORTANT: This is basically used to initiate a conversation */
export const sendMessage = async (sender, receiver, text) => {
  // initialize, because this method creates new chat if not found
  await getChatByUsernameForUser(sender, receiver);
  // send
  await sendChat(sender, receiver, text);

  return true;
};

export const chatSeen = async (sender, receiver, chatId) => {
  if (!mongoose.Types.ObjectId.isValid(chatId))
    return {
      errors: [
        {
          msg: 'User not found',
          status: '404',
        },
      ],
    };
  const chats = await Conversation.findOneAndUpdate(
    {
      participants: [sender, receiver],
      'chats._id': chatId,
    },
    { 'chats.$.seen': true },
    { new: true },
  );

  if (!chats || chats.length === 0) {
    return {
      participants: [sender, receiver],
      chats: [],
    };
  }
  return chats;
};
