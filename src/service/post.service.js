import { getLinkPreview } from 'link-preview-js';
import { BookmarkPost } from '../model/bookmark.model.js';
import { Post } from '../model/post.model.js';
import * as activityService from './activity.service.js';
import { tryMakeMetadata } from './linkPreview.service.js';
import * as notificationService from './notification.service.js';
import * as userService from './user.service.js';

export const getAllPosts = async (tokenUser) => {
  const posts = await Post.aggregate([
    { $match: {} },
    {
      $project: {
        author: 1,
        text: 1,
        date: 1,
        url: 1,
        title: 1,
        description: 1,
        image: 1,
        site_name: 1,
        favicon: 1,
        author_image: 1,
        created_at: 1,
        commentCount: { $size: '$comments' },
        loveCount: { $size: '$loves' },
        isLovedByMe: {
          $in: [tokenUser, '$loves.author'],
        },
        tags: 1,
      },
    },
  ]).exec();

  return posts;
};

export const getPostById = async (id) => {
  return await Post.findOne({
    _id: id,
  });
};

export const getAllPostsByTags = async (tags, tokenUser) => {
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
        commentCount: { $size: '$comments' },
        loveCount: { $size: '$loves' },
        isLovedByMe: {
          $in: [tokenUser, '$loves.author'],
        },
        tags: 1,
      },
    },
  ]).exec();

  return posts;
};

export const createPost = async (author, url, tags) => {
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
    summary: 'posted',
    link: `/post/${post._id}`,
  };
  await activityService.createActivity(data);

  return post;
};

const extractUrlMetadata = async (url) => {
  try {
    return await getLinkPreview(url);
  } catch (error) {
    console.error('Error extracting metadata:', error);
    return await tryMakeMetadata(url);
  }
};

export const createComment = async (author, text, postId) => {
  // if same comment is already there then return
  const existingCommentPost = await Post.findOne({
    _id: postId,
    'comments.author': author,
    'comments.text': text,
  });
  if (existingCommentPost) {
    return existingCommentPost;
  }

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
    },
  );

  await notificationService.createCommentNotification(post, author);

  const data = {
    username: author,
    summary: `commented on ${post.author}'s post`,
    extraText: text.substring(0, 50),
    link: `/post/${post._id}`,
  };
  await activityService.createActivity(data);

  return post;
};

export const reactLove = async (author, postId) => {
  const post = await Post.findOne({
    _id: postId,
    'loves.author': author,
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
    },
  );

  const data = {
    username: author,
    summary: `reacted love on ${postUpdate.author}'s post`,
    link: `/post/${postUpdate._id}`,
  };
  await activityService.createActivity(data);

  return postUpdate;
};

export const getPostsByUsername = async (username, tokenUser) => {
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
        description: 1,
        image: 1,
        author_image: 1,
        site_name: 1,
        favicon: 1,
        created_at: 1,
        commentCount: { $size: '$comments' },
        loveCount: { $size: '$loves' },
        isLovedByMe: {
          $in: [tokenUser, '$loves.author'],
        },
        tags: 1,
      },
    },
  ]).exec();
  return posts;
};

export const deletePost = async (id, username) => {
  await Post.findOneAndDelete({
    _id: id,
    author: username,
  });
  return true;
};

export const checkIfBookmarked = async (postId, username) => await BookmarkPost.findOne({ post_ids: postId, username });

export const bookmarkPost = async (postId, username) => {
  const previouslyBookmarkedPosts = await BookmarkPost.findOne({ username });

  // if user previously has bookmarks just update
  if (previouslyBookmarkedPosts) {
    return await BookmarkPost.findOneAndUpdate({ username }, { $push: { post_ids: postId } }, { new: true });
  }

  // if its the user first bookmark create
  const bookmarkData = {
    post_ids: [postId],
    username,
  };
  return await BookmarkPost.create(bookmarkData);
};

export const unbookmarkPost = async (postId, username) => {
  return await BookmarkPost.findOneAndUpdate({ username }, { $pull: { post_ids: postId } }, { new: true });
};

export const bookmarks = async (username) => {
  const bookmark = await BookmarkPost.findOne({ username });
  if (!bookmark) {
    return [];
  }

  const userBookmarkedPosts = await Post.aggregate([
    {
      $match: {
        _id: { $in: bookmark.post_ids },
      },
    },
    {
      $project: {
        author: 1,
        text: 1,
        date: 1,
        url: 1,
        title: 1,
        description: 1,
        image: 1,
        author_image: 1,
        site_name: 1,
        favicon: 1,
        created_at: 1,
        commentCount: { $size: '$comments' },
        loveCount: { $size: '$loves' },
        isLovedByMe: {
          $in: [username, '$loves.author'],
        },
        tags: 1,
      },
    },
  ]).exec();

  return userBookmarkedPosts;
};

export const deleteComment = async (username, postId, commentId) => {
  const post = await Post.findById(postId);
  if (post == null) {
    throw new Error('post not found');
  }

  const comment = post.comments.find((c) => c._id == commentId);
  if (post.author !== username && comment.author !== username) {
    throw new Error('not authorized');
  }

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      $pull: {
        comments: { _id: commentId },
      },
    },
    { new: true },
  );

  return updatedPost;
};

export const getUserFeedPosts = async (username) => {
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
      (firstEl, secondEl) => new Date(secondEl.created_at) - new Date(firstEl.created_at),
    );

    return sortedPosts;
  }

  return await Post.find().sort({ created_at: -1 }).exec();
};
