const PostModel = require("../model/post.model");
const Post = PostModel.Post;
const BookmarkPostModel = require("../model/bookmark.model");
const BookmarkPost = BookmarkPostModel.BookmarkPost;

const userService = require("./user.service");

const userService = require("./user.service");

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
        author_image: 1,
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

exports.getAllPostsByTags = async (tags) => {
  // Filter by tags if provided
  const posts = await Post.aggregate([
    {
      $match: {
        tags: { $in: tags },
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
        author_image: 1,
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

exports.createPost = async (author, url, tags) => {
  let userMeta = await userService.getUserMeta(author);
  if (!userMeta) {
    userMeta = {};
  }

  const metadata = await extractUrlMetadata(url);

  const post = await Post.create({
    author: author,
    url: url,
    title: metadata.title,
    description: metadata.description,
    image: metadata.images[0],
    author_image: userMeta.image || "",
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
          created_at: new Date(),
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
        author_image: 1,
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

exports.deletePost = async (id, username) => {
  await Post.findOneAndDelete({
    _id: id,
    author: username,
  });
  return true;
};

exports.checkIfBookmarked = async (postId, username) =>
  await BookmarkPost.findOne({ post_ids: postId, username });

exports.bookmarkPost = async (postId, username) => {
  const previouslyBookmarkedPosts = await BookmarkPost.findOne({ username });

  // if user previously has bookmarks just update
  if (previouslyBookmarkedPosts) {
    return await BookmarkPost.findOneAndUpdate(
      { username },
      { $push: { post_ids: postId } },
      { new: true }
    );
  }

  // if its the user first bookmark create
  const bookmarkData = {
    post_ids: [postId],
    username,
  };
  return await BookmarkPost.create(bookmarkData);
};

exports.bookmarks = async (username) => {
  const bookmark = await BookmarkPost.findOne({ username });
  let userBookmarkedPosts = [];
  for (let i = 0; i < bookmark.post_ids.length; i++) {
    const post = await Post.findById(bookmark.post_ids[i]);
    userBookmarkedPosts.push(post);
  }
  return userBookmarkedPosts;
};

exports.getUserFeedPosts = async (username) => {
  let feedPosts = [];
  const user = await userService.getUserByUsername(username);
  if (user && user.following.length > 0) {
    const post = await Post.find({ author: { $in: user.following } });
    feedPosts = [...feedPosts, ...post];

    if (feedPosts.length < 50) {
      const morePosts = await Post.find({ author: { $nin: user.following } });
      feedPosts = [...feedPosts, ...morePosts];
    }

    const sortedPosts = feedPosts.sort(
      (firstEl, secondEl) =>
        new Date(secondEl.created_at) - new Date(firstEl.created_at)
    );

    return sortedPosts;
  }

  return await Post.find().sort({ created_at: -1 }).exec();
};
