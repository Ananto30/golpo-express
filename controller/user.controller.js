const { body, query, validationResult } = require("express-validator");

const userService = require("../service/user.service");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json({ users: users });
  } catch (err) {
    res.status(500).json({ errors: err.message });
    console.log(err);
    return;
  }
};

exports.getUserMetaByToken = async (req, res) => {
  try {
    const { username } = req.decoded;

    const userMeta = await userService.getUserMeta(username);

    res.status(200).json(userMeta);
  } catch (err) {
    res.status(500).json({ errors: err.message });
    console.log(err);
    return;
  }
};

exports.getUserMetaByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const userMeta = await userService.getUserMeta(username);

    res.status(200).json(userMeta);
  } catch (err) {
    res.status(500).json({ errors: err.message });
    console.log(err);
    return;
  }
};

exports.updateMeta = async (req, res) => {
  try {
    const { username } = req.decoded;

    const userMeta = await userService.updateUserMeta(username, req.body);

    res.status(200).json(userMeta);
  } catch (err) {
    res.status(500).json({ errors: err.message });
    console.log(err);
    return;
  }
};

exports.getUsersMeta = async (req, res) => {
  try {
    const { usernames } = req.query;

    const usersMeta = await userService.getUsersMeta(usernames);

    res.status(200).json({ users: usersMeta });
  } catch (err) {
    res.status(500).json({ errors: err.message });
    console.log(err);
    return;
  }
};

exports.validators = {
  updateMeta: {
    work: { in: ["body"] },
    tagline: { in: ["body"] },
    image: { in: ["body"] },
  },
  getUsersMeta: {
    usernames: {
      in: ["query"],
      isArray: true,
    },
  },
};
