import mongoose from 'mongoose';
import config from '../config.js';
import { Notification } from '../model/notification.model.js';

mongoose.connect(config.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const deleteNotifications = async () => {
  try {
    const result = await Notification.deleteMany({ $expr: { $eq: ['$username', '$comment_author'] } });
    console.log(`Deleted ${result.deletedCount} notifications`);
  } catch (err) {
    console.error('Error deleting notifications:', err);
  } finally {
    mongoose.disconnect();
  }
};

deleteNotifications();
