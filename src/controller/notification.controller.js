import * as notificationService from '../service/notification.service.js';

// Not needed but incase

// export const createCommentNotification = async (req, res) => {
//   try {
//     const comment_author = req.decoded.username;
//     const postId = req.params.id;

//     const notification = await notificationService.createCommentNotification(
//       postId,
//       comment_author
//     );

//     res.status(200).json(notification);
//   } catch (err) {
//     res.status(500).json({ errors: err.message });
//     console.log(err);
//     return;
//   }
// };

export const getNotificationsByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const notifications = await notificationService.getNotificationsByUsername(username);

    res.status(200).json({ notifications });
  } catch (err) {
    res.status(500).json({ errors: err.message });
    console.log(err);
    return;
  }
};

export const notificationClicked = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.decoded;

    const notification = await notificationService.findOneNotificationById(id);

    if (!notification) {
      res.status(404).json({ errors: 'Notification not found' });
      return;
    }

    if (notification.comment_author !== username) {
      res.status(405).json({ errors: 'Not allowed' });
      return;
    }

    const clickedNotification = await notificationService.notificationClicked(id);

    res.status(200).json({ clickedNotification });
  } catch (err) {
    res.status(500).json({ errors: err.message });
    console.log(err);
    return;
  }
};
