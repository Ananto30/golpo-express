import express from 'express';
import * as activityController from '../src/controller/activity.controller.js';
import * as tokenMiddleware from '../src/middleware/token.js';

const router = express.Router();

router.get('/', tokenMiddleware.checkToken, activityController.getAllActivities);

router.get('/me', tokenMiddleware.checkToken, activityController.getActivitiesByToken);

export default router;
