import express from 'express';
import * as notificationController from '../src/controller/notification.controller.js';
import * as tokenMiddleware from '../src/middleware/token.js';

const router = express.Router();

router.get('/:username', tokenMiddleware.checkToken, notificationController.getNotificationsByUsername);

router.post('/:id/clicked', tokenMiddleware.checkToken, notificationController.notificationClicked);

export default router;
