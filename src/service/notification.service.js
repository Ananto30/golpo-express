import { Notification } from '../model/notification.model.js';

export const createCommentNotification = async (post, comment_author) => {
  const username = post.author;
  if (username === comment_author) return;

  const notificationData = {
    post_id: post._id,
    username,
    comment_author,
    clicked: false,
    created_at: new Date(),
  };
  const commentNotification = await Notification.create(notificationData);
  return commentNotification;
};

export const getNotificationsByUsername = async (username) => await Notification.find({ username: username });

export const findOneNotificationById = async (id) => await Notification.findById(id);

export const notificationClicked = async (id) =>
  await Notification.findOneAndUpdate({ _id: id }, { clicked: true }, { new: true });
