import express from 'express';
const router = express.Router();

import * as activityController from '../controller/activity.controller.js';
import { checkToken } from '../middleware/token.js';

router.get('/', checkToken, activityController.getAllActivities);

router.get('/me', checkToken, activityController.getActivitiesByToken);

export default router;
