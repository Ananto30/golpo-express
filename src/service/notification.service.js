import { Notification } from '../model/notification.model.js';
import * as postService from './post.service.js';

export const createCommentNotification = async (postId, comment_author) => {
  const post = await postService.getPostById(postId);
  const username = post.author;

  const notificationData = {
    post_id: postId,
    username,
    comment_author,
    clicked: false,
    created_at: new Date(),
  };
  const commentNotification = await Notification.create(notificationData);
  return commentNotification;
};

export const getNotificationsByUsername = async (username) => await Notification.find({ comment_author: username });

export const findOneNotificationById = async (id) => await Notification.findById(id);

export const notificationClicked = async (id) =>
  await Notification.findOneAndUpdate({ _id: id }, { clicked: true }, { new: true });
