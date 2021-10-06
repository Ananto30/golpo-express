const PostModel = require("../model/post.model");
const Post = PostModel.Post;

const activityService = require("./activity.service");

exports.getAllPostsWithCommentCount = async () => {
  const posts = await Post.aggregate([
    { $match: {} },
    {
      $project: {
        author: 1,
        text: 1,
        date: 1,
        comments: { $size: "$comments" },
      },
    },
  ]).exec();

  return posts;
};

exports.getPostById = async (id) => {
  return await Post.findOne({
    _id: id,
  });
};

exports.createPost = async (author, url, tags) => {
  
  const post = await Post.create({
    author: author,
    url: url,
    date: new Date(),
    comments: [],
    loves: [],
    tags: tags
  });

  const data = {
    username: author,
    summary: "posted",
    link: `/post/${post._id}`,
  };
  await activityService.createActivity(data);

  return post;
};

exports.createComment = async (author, text, postId) => {
  const post = await Post.findOneAndUpdate(
    {
      _id: postId,
    },
    {
      $push: {
        comments: {
          author: author,
          text: text,
          date: new Date(),
        },
      },
    },
    {
      new: true,
    }
  );

  const data = {
    username: author,
    summary: `commented on ${post.author}'s post`,
    extraText: text.substring(0, 50),
    link: `/post/${post._id}`,
  };
  await activityService.createActivity(data);

  return post;
};

exports.reactLove = async (author, postId) => {
  const post = await Post.findOne({
    _id: postId,
    "loves.author": author,
  });
  if (post) {
    return post;
  }
  const postUpdate = await Post.findOneAndUpdate(
    {
      _id: postId,
    },
    {
      $push: {
        loves: {
          author: author,
        },
      },
    },
    {
      new: true,
    }
  );

  const data = {
    username: author,
    summary: `reacted love on ${postUpdate.author}'s post`,
    link: `/post/${postUpdate._id}`,
  };
  await activityService.createActivity(data);

  return postUpdate;
};

exports.getPostsByUsername = async (username) => {
  const posts = await Post.aggregate([
    {
      $match: {
        author: username,
      },
    },
    {
      $project: {
        author: 1,
        text: 1,
        date: 1,
        comments: { $size: "$comments" },
      },
    },
  ]).exec();
  return posts;
};
