import * as chatService from '../service/conversation.service.js';

export const getChats = async (req, res) => {
  try {
    const { username } = req.decoded;
    const chats = await chatService.getChatListAndLastChatForUser(username);

    res.status(200).json({ chats: chats });
  } catch (err) {
    res.status(500).json({ errors: err.message });
    console.log(err);
    return;
  }
};

export const getByReceiver = async (req, res) => {
  try {
    const { username } = req.decoded;
    const { receiver } = req.params;
    const chats = await chatService.getChatByUsernameForUser(username, receiver);

    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ errors: err.message });
    console.log(err);
    return;
  }
};

export const sendChat = async (req, res) => {
  try {
    const { text } = req.body;
    const { receiver } = req.params;
    const { username } = req.decoded;

    const chats = await chatService.sendChat(username, receiver, text);

    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ errors: err.message });
    console.log(err);
    return;
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { receiver } = req.params;
    const { username } = req.decoded;

    const chats = await chatService.sendMessage(username, receiver, text);

    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ errors: err.message });
    console.log(err);
    return;
  }
};

export const chatSeen = async (req, res) => {
  try {
    const { receiver, chatId } = req.params;
    const { username } = req.decoded;

    const post = await chatService.chatSeen(username, receiver, chatId);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ errors: err.message });
    console.log(err);
    return;
  }
};

export const validators = {
  sendChat: {
    receiver: {
      in: ['params'],
      isEmpty: { negated: true },
    },
    text: {
      in: ['body'],
      isEmpty: { negated: true },
    },
  },
};
