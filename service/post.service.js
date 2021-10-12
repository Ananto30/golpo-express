const PostModel = require("../model/post.model");
const Post = PostModel.Post;

const activityService = require("./activity.service");
const notificationService = require("./notification.service");
const { getLinkPreview } = require("link-preview-js");

exports.getAllPosts = async () => {
  const posts = await Post.aggregate([
    { $match: {} },
    {
      $project: {
        author: 1,
        text: 1,
        date: 1,
        url: 1,
        title: 1,
        loves: 1,
        description: 1,
        image: 1,
        site_name: 1,
        favicon: 1,
        created_at: 1,
        commentCount: { $size: "$comments" },
        loveCount: { $size: "$loves" },
        tags: 1,
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
  const metadata = await extractUrlMetadata(url);

  const post = await Post.create({
    author: author,
    url: url,
    title: metadata.title,
    description: metadata.description,
    image: metadata.images[0],
    site_name: metadata.siteName,
    favicon: metadata.favicons[0],
    created_at: new Date(),
    comments: [],
    loves: [],
    tags: tags,
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

  await notificationService.createCommentNotification(postId, author);

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
        url: 1,
        title: 1,
        loves: 1,
        description: 1,
        image: 1,
        site_name: 1,
        favicon: 1,
        created_at: 1,
        commentCount: { $size: "$comments" },
        loveCount: { $size: "$loves" },
        tags: 1,
      },
    },
  ]).exec();
  return posts;
};

const extractUrlMetadata = async (url) => {
  const metadata = await getLinkPreview(url);
  return metadata;
};
