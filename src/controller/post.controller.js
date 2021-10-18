const { tags, adultURLs } = require("../constants");
const postService = require("../service/post.service");

exports.getAll = async (req, res) => {
  const tags = req.query.tags;
  try {
    let posts;
    // Filter by tags if provided
    if (!!tags && tags.length > 0) {
      posts = await postService.getAllPostsByTags(tags.split(","));
    } else {
      posts = await postService.getAllPosts();
    }
    posts.forEach(function (post) {
      post.isLovedByMe = false;
      post.loves.forEach(function (love) {
        if (love.author === req.decoded.username)
          return (post.isLovedByMe = true);
      });
    });
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

    post.isLovedByMe = false;
    post.loves.forEach(function (love) {
      if (love.author === req.decoded.username)
        return (post.isLovedByMe = true);
    });

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
    posts.forEach(function (post) {
      post.isLovedByMe = false;
      post.loves.forEach(function (love) {
        if (love.author === req.decoded.username)
          return (post.isLovedByMe = true);
      });
    });

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

exports.getAllTags = (req, res) => {
  res.status(200).json({ tags });
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.decoded;

    const deleted = await postService.deletePost(id, username);

    res.status(200).json(deleted);
  } catch (err) {
    res.status(500).json({ errors: err.message });
    console.log(err);
    return;
  }
};

exports.bookmarkPost = async (req, res) => {
  try {
    const { username } = req.decoded;
    const { postId } = req.params;

    const checkIfPreviouslyBookmarked = await postService.checkIfBookmarked(
      postId,
      username
    );

    if (checkIfPreviouslyBookmarked) {
      res.status(404).json({ errors: "post already bookmarked" });
      return;
    }

    const verifyPost = await postService.getPostById(postId);
    if (!verifyPost) res.status(404).json({ errors: "post not found" });

    const bookmarkedpost = await postService.bookmarkPost(postId, username);

    res.status(200).json({ bookmarkedpost });
  } catch (err) {
    res.status(500).json({ errors: err.message });
    console.log(err);
    return;
  }
};

exports.bookmarks = async (req, res) => {
  try {
    const { username } = req.decoded;
    const bookmarks = await postService.bookmarks(username);
    res.status(200).json({ bookmarks });
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

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.decoded;

    const deleted = await postService.deletePost(id, username);

    res.status(200).json(deleted);
  } catch (err) {
    res.status(500).json({ errors: err.message });
    console.log(err);
    return;
  }
};

exports.bookmarkPost = async (req, res) => {
  try {
    const { username } = req.decoded;
    const { postId } = req.params;

    const checkIfPreviouslyBookmarked = await postService.checkIfBookmarked(
      postId,
      username
    );

    if (checkIfPreviouslyBookmarked) {
      res.status(404).json({ errors: "post already bookmarked" });
      return;
    }

    const verifyPost = await postService.getPostById(postId);
    if (!verifyPost) res.status(404).json({ errors: "post not found" });

    const bookmarkedpost = await postService.bookmarkPost(postId, username);

    res.status(200).json({ bookmarkedpost });
  } catch (err) {
    res.status(500).json({ errors: err.message });
    console.log(err);
    return;
  }
};

exports.bookmarks = async (req, res) => {
  try {
    const { username } = req.decoded;
    const bookmarks = await postService.bookmarks(username);
    res.status(200).json({ bookmarks });
  } catch (err) {
    res.status(500).json({ errors: err.message });
    console.log(err);
    return;
  }
};

exports.getUserFeedPosts = async (req, res) => {
  try {
    const feedPosts = await postService.getUserFeedPosts(req.decoded.username);
    res.status(200).json({ feedPosts });
  } catch (err) {
    res.status(500).json({ errors: err.message });
    console.log(err);
    return;
  }
};
