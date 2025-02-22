import { connection } from '../controller/socket.controller.js';
import { Activity } from '../model/activity.model.js';

export const getAll = async () => {
  return await Activity.find({});
};

export const getLatest = async (limit) => {
  return await Activity.find({}).sort({ date: -1 }).limit(limit);
};

export const getByUsername = async (username) => {
  return await Activity.find({ username: username });
};

export const createActivity = async (data) => {
  const actData = {
    username: data.username,
    summary: data.summary,
    link: data.link,
    date: new Date(),
    extra_text: data.extraText,
    extra_images: data.extraImages,
  };
  const activity = await Activity.create(actData);
  // sendSocketActivity(activity);
  return activity;
};

const sendSocketActivity = (data) => {
  const io = connection();
  io.sendToAll('activity', JSON.stringify(data));
};
