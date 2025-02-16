import express from 'express';
import * as postController from '../src/controller/post.controller.js';
import * as tokenMiddleware from '../src/middleware/token.js';
import validateSchema from '../src/middleware/validate.js';

const router = express.Router();

router.get('/tags', postController.getAllTags);
router.get('/bookmarks', tokenMiddleware.checkToken, postController.bookmarks);
router.get('/feed', tokenMiddleware.checkToken, postController.getUserFeedPosts);
router.get('/', tokenMiddleware.checkToken, postController.getAll);
router.get('/:id', tokenMiddleware.checkToken, postController.getById);

router.post('/:id/delete', tokenMiddleware.checkToken, postController.deletePost);

router.post(
  '/',
  tokenMiddleware.checkToken,
  validateSchema(postController.validators.validateUrl),
  postController.createPost,
);

router.post(
  '/:postId/comment',
  tokenMiddleware.checkToken,
  validateSchema(postController.validators.validateComment),
  postController.createComment,
);

router.post('/:postId/love', tokenMiddleware.checkToken, postController.reactLove);

router.post('/:postId/bookmark', tokenMiddleware.checkToken, postController.bookmarkPost);

router.get('/user/me', tokenMiddleware.checkToken, postController.getPostsByToken);

router.get('/user/:username', tokenMiddleware.checkToken, postController.getPostsByUsername);

router.post('/:postId/comment/:commentId/delete', tokenMiddleware.checkToken, postController.deleteComment);

export default router;
