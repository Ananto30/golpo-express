import express from 'express';
import * as authController from '../src/controller/auth.controller.js';
import validateSchema from '../src/middleware/validate.js';

const router = express.Router();

router.post('/login', validateSchema(authController.validators.login), authController.login);

router.post('/login/google', authController.googleLogin);

router.get('/login/google/getAuthUrl', authController.getGoogleAuthUrl);

router.post(
  '/login/google/getToken',
  validateSchema(authController.validators.getTokenByGoogleCode),
  authController.getTokenByGoogleCode,
);

export default router;
