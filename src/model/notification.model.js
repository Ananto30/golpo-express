import mongoose from 'mongoose';

const { Schema } = mongoose;

const notificationSchema = new Schema({
  post_id: String,
  username: String,
  comment_author: String,
  clicked: Boolean,
  created_at: Date,
});

export const Notification = mongoose.model('Notification', notificationSchema);
