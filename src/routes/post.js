const express = require("express");
const router = express.Router();

const postController = require("../controller/post.controller");
const tokenMiddleware = require("../middleware/token");
const validateSchema = require("../middleware/validate");

router.get("/tags", postController.getAllTags);
router.get("/bookmarks", tokenMiddleware.checkToken, postController.bookmarks);
router.get("/", tokenMiddleware.checkToken, postController.getAll);
router.get("/:id", tokenMiddleware.checkToken, postController.getById);

router.post(
  "/:id/delete",
  tokenMiddleware.checkToken,
  postController.deletePost
);

router.post(
  "/",
  tokenMiddleware.checkToken,
  validateSchema(postController.validators.validateUrl),
  postController.createPost
);

router.post(
  "/:postId/comment",
  tokenMiddleware.checkToken,
  validateSchema(postController.validators.validateComment),
  postController.createComment
);

router.post(
  "/:postId/love",
  tokenMiddleware.checkToken,
  postController.reactLove
);

router.post(
  "/:postId/bookmark",
  tokenMiddleware.checkToken,
  postController.bookmarkPost
);

router.get(
  "/user/me",
  tokenMiddleware.checkToken,
  postController.getPostsByToken
);

router.get(
  "/user/:username",
  tokenMiddleware.checkToken,
  postController.getPostsByUsername
);

module.exports = router;
