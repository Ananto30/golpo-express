import express from 'express';
import * as userController from '../src/controller/user.controller.js';
import * as tokenMiddleware from '../src/middleware/token.js';
import validateSchema from '../src/middleware/validate.js';

const router = express.Router();

router.get('/', tokenMiddleware.checkToken, userController.getAllUsers);

router.get('/me', tokenMiddleware.checkToken, userController.getUserMetaByToken);

router.post(
  '/get_users_meta',
  tokenMiddleware.checkToken,
  validateSchema(userController.validators.getUsersMeta),
  userController.getUsersMeta,
);

router.post(
  '/me/update',
  tokenMiddleware.checkToken,
  validateSchema(userController.validators.updateMeta),
  userController.updateMeta,
);

router.get('/:username', tokenMiddleware.checkToken, userController.getUserDetails);

router.post('/:username/follow', tokenMiddleware.checkToken, userController.followUser);

router.post('/:username/unfollow', tokenMiddleware.checkToken, userController.unFollowUser);

router.get('/:username/followers', tokenMiddleware.checkToken, userController.getFollowers);

router.get('/:username/following', tokenMiddleware.checkToken, userController.getFollowing);

export default router;
