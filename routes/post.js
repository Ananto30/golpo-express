const express = require("express");
const router = express.Router();

const postController = require("../controller/post.controller");
const tokenMiddleware = require("../middleware/token");

router.get("/tags", postController.getAllTags);
router.get("/", tokenMiddleware.checkToken, postController.getAll);
router.get("/:id", tokenMiddleware.checkToken, postController.getById);


router.post(
  "/",
  tokenMiddleware.checkToken,
  postController.validate("createPost"),
  postController.createPost
);

router.post(
  "/:postId/comment",
  tokenMiddleware.checkToken,
  postController.validate("createPost"),
  postController.createComment
);

router.post(
  "/:postId/love",
  tokenMiddleware.checkToken,
  postController.reactLove
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
