import express from 'express';

const router = express.Router();

import * as notificationController from '../controller/notification.controller.js';
import { checkToken } from '../middleware/token.js';

router.get('/:username', checkToken, notificationController.getNotificationsByUsername);

router.post('/:id/clicked', checkToken, notificationController.notificationClicked);

export default router;
