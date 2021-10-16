const express = require("express");
const router = express.Router();

const userController = require("../controller/user.controller");
const tokenMiddleware = require("../middleware/token");
const validateSchema = require("../middleware/validate");

router.get("/", tokenMiddleware.checkToken, userController.getAllUsers);

router.get(
  "/me",
  tokenMiddleware.checkToken,
  userController.getUserMetaByToken
);

router.get(
  "/usersmeta",
  tokenMiddleware.checkToken,
  validateSchema(userController.validators.getUsersMeta),
  userController.getUsersMeta
);

router.post(
  "/me/update",
  tokenMiddleware.checkToken,
  validateSchema(userController.validators.updateMeta),
  userController.updateMeta
);

router.get(
  "/:username",
  tokenMiddleware.checkToken,
  userController.getUserDetails
);

router.post(
  "/:username/follow",
  tokenMiddleware.checkToken,
  userController.followUser
);

router.post(
  "/:username/unfollow",
  tokenMiddleware.checkToken,
  userController.unFollowUser
);

module.exports = router;
