import express from 'express';

const router = express.Router();

import * as userController from '../controller/user.controller.js';
import { checkToken } from '../middleware/token.js';
import validateSchema from '../middleware/validate.js';

router.get('/', checkToken, userController.getAllUsers);

router.get('/me', checkToken, userController.getUserMetaByToken);

router.post(
  '/get_users_meta',
  checkToken,
  validateSchema(userController.validators.getUsersMeta),
  userController.getUsersMeta,
);

router.post('/me/update', checkToken, validateSchema(userController.validators.updateMeta), userController.updateMeta);

router.get('/:username', checkToken, userController.getUserDetails);

router.post('/:username/follow', checkToken, userController.followUser);

router.post('/:username/unfollow', checkToken, userController.unFollowUser);

router.get('/:username/followers', checkToken, userController.getFollowers);

router.get('/:username/following', checkToken, userController.getFollowing);

export default router;
