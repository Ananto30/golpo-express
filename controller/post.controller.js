const { tags, adultURLs } = require("../constants");
const postService = require("../service/post.service");

exports.getAll = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    res.status(200).json({ posts: posts });
  } catch (err) {
    res.status(500).json({ errors: err.message });
    console.log(err);
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
    console.log(err);
    return;
  }
};

exports.createPost = async (req, res) => {
  try {
    const { url } = req.body;
    const { username } = req.decoded;
    const { tags } = req.body;

    const post = await postService.createPost(username, url, tags);

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ errors: err.message });
    console.log(err);
    return;
  }
};

exports.createComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { username } = req.decoded;
    const { postId } = req.params;

    const post = await postService.createComment(username, text, postId);

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ errors: err.message });
    console.log(err);
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
    console.log(err);
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
    console.log(err);
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
    console.log(err);
    return;
  }
};

exports.validators = {
  validateComment: {
    text: {
      isLength: {
        errorMessage: "test should be between 1 and 100 characters",
        options: { min: 1, max: 100 },
      },
    },
  },

  validateUrl: {
    url: {
      isUrl: {
        errorMessage: "Must be a Valid URL",
        options: {
          protocols: ["http", "https", "ftp"],
          require_tld: true,
          require_protocol: true,
        },
      },
      isIn: {
        negated: true,
        options: adultURLs,
        errorMessage: "Adult contents are not allowed",
      },
    },
  },
};

exports.getAllTags = (req, res) => {
  res.status(200).json({ tags });
};
