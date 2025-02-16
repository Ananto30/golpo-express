import express from 'express';
import * as chatController from '../src/controller/chat.controller.js';
import * as tokenMiddleware from '../src/middleware/token.js';
import validateSchema from '../src/middleware/validate.js';

const router = express.Router();

router.get('/', tokenMiddleware.checkToken, chatController.getChats);

router.get('/:receiver', tokenMiddleware.checkToken, chatController.getByReceiver);

router.post(
  '/:receiver',
  tokenMiddleware.checkToken,
  validateSchema(chatController.validators.sendChat),
  chatController.sendChat,
);

router.post(
  '/:receiver/message',
  tokenMiddleware.checkToken,
  validateSchema(chatController.validators.sendChat),
  chatController.sendMessage,
);

router.put('/:receiver/:chatId/seen', tokenMiddleware.checkToken, chatController.chatSeen);

export default router;
