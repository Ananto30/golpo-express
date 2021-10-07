const express = require("express");
const router = express.Router();

const chatController = require("../controller/chat.controller");
const tokenMiddleware = require("../middleware/token");
const validateSchema = require("../middleware/validate");

router.get("/", tokenMiddleware.checkToken, chatController.getChats);

router.get(
  "/:receiver",
  tokenMiddleware.checkToken,
  chatController.getByReceiver
);

router.post(
  "/:receiver",
  tokenMiddleware.checkToken,
  validateSchema(chatController.validators.sendChat),
  chatController.sendChat
);

router.post(
  "/:receiver/message",
  tokenMiddleware.checkToken,
  validateSchema(chatController.validators.sendChat),
  chatController.sendMessage
);

module.exports = router;
