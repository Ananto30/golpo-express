import * as notificationService from '../service/notification.service.js';

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

    if (notification.username !== username) {
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
