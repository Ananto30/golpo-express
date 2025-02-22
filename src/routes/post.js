import express from 'express';

const router = express.Router();

import * as postController from '../controller/post.controller.js';
import { checkToken } from '../middleware/token.js';
import validateSchema from '../middleware/validate.js';

router.get('/tags', postController.getAllTags);
router.get('/bookmarks', checkToken, postController.bookmarks);
router.get('/feed', checkToken, postController.getUserFeedPosts);
router.get('/', checkToken, postController.getAll);
router.get('/:id', checkToken, postController.getById);

router.post('/:id/delete', checkToken, postController.deletePost);

router.post('/', checkToken, validateSchema(postController.validators.validateUrl), postController.createPost);

router.post(
  '/:postId/comment',
  checkToken,
  validateSchema(postController.validators.validateComment),
  postController.createComment,
);

router.post('/:postId/love', checkToken, postController.reactLove);

router.post('/:postId/bookmark', checkToken, postController.bookmarkPost);

router.post('/:postId/unbookmark', checkToken, postController.unbookmarkPost);

router.get('/user/me', checkToken, postController.getPostsByToken);

router.get('/user/:username', checkToken, postController.getPostsByUsername);

router.post('/:postId/comment/:commentId/delete', checkToken, postController.deleteComment);

export default router;
