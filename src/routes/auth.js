import express from 'express';

const router = express.Router();

import * as authController from '../controller/auth.controller.js';
import validateSchema from '../middleware/validate.js';

router.post('/login', validateSchema(authController.validators.login), authController.login);

router.post('/login/google', authController.googleLogin);

router.get('/login/google/getAuthUrl', authController.getGoogleAuthUrl);

router.post(
  '/login/google/getToken',
  validateSchema(authController.validators.getTokenByGoogleCode),
  authController.getTokenByGoogleCode,
);

export default router;
