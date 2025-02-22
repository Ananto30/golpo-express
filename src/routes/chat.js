import express from 'express';

const router = express.Router();

import * as chatController from '../controller/chat.controller.js';
import { checkToken } from '../middleware/token.js';
import validateSchema from '../middleware/validate.js';

router.get('/', checkToken, chatController.getChats);

router.get('/:receiver', checkToken, chatController.getByReceiver);

router.post('/:receiver', checkToken, validateSchema(chatController.validators.sendChat), chatController.sendChat);

router.post(
  '/:receiver/message',
  checkToken,
  validateSchema(chatController.validators.sendChat),
  chatController.sendMessage,
);

router.put('/:receiver/:chatId/seen', checkToken, chatController.chatSeen);

export default router;
