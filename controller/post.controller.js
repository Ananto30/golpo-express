const { body, validationResult } = require("express-validator");
const {tags, adultURLs} = require('../constants');
const postService = require("../service/post.service");

exports.getAll = async (req, res) => {
  try {
    const posts = await postService.getAllPostsWithCommentCount();

    res.status(200).json({ posts: posts });
  } catch (err) {
    res.status(500).json({ errors: err.message });
    return;
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postService.getPostById(id);

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ errors: err.message });
    return;
  }
};

exports.createPost = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    
    const { url } = req.body;
    const { username } = req.decoded;
    const { tags } = req.body;

    const post = await postService.createPost(username, url, tags);

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ errors: err.message });
    return;
  }
};

exports.createComment = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }

    const { text } = req.body;
    const { username } = req.decoded;
    const { postId } = req.params;

    const post = await postService.createComment(username, text, postId);

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ errors: err.message });
    return;
  }
};

exports.reactLove = async (req, res) => {
  try {
    const { username } = req.decoded;
    const { postId } = req.params;

    const post = await postService.reactLove(username, postId);

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ errors: err.message });
    return;
  }
};

exports.getPostsByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const posts = await postService.getPostsByUsername(username);

    res.status(200).json({ posts });
  } catch (err) {
    res.status(500).json({ errors: err.message });
    return;
  }
};

exports.getPostsByToken = async (req, res) => {
  try {
    const { username } = req.decoded;
    const posts = await postService.getPostsByUsername(username);

    res.status(200).json({ posts });
  } catch (err) {
    res.status(500).json({ errors: err.message });
    return;
  }
};

exports.validate = (method) => {
  switch (method) {
    case "validateComment": {
      return [
        body("text", "text should be between 1 to 1000 characters").isLength({
          min: 1,
          max: 1000,
        }),
      ];
    }
    case "validateUrl": {
      return [
        body("url", "Must be a Valid URL").isURL({
          protocols: ["http", "https", "ftp"],
          require_tld: true,
          require_protocol: true,
        }),
        body("url", "Adult contents are not allowed").isIn(!adultURLs)
      ];
    }
  }
};

exports.getAllTags = (req,res) => {
  res.status(200).json({tags})
}
