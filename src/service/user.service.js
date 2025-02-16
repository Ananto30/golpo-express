import { User, UserInfo } from '../model/user.model.js';
import * as activityService from './activity.service.js';

export const getUserByUsernameAndPass = async (username, password) => {
  return await User.findOne({
    username: username,
    password: password,
  });
};

export const getUserByGoogleMail = async (email) => {
  return await User.findOne({
    google_email: email,
  });
};

export const getUserByUsername = async (username) => {
  return await User.findOne({
    username: username,
  });
};

export const createUser = async (data) => {
  return await User.create(data);
};

export const updateUser = async (username, updateInfo) => {
  let updates = {};
  if (updateInfo.google_token) updates['google_token'] = updateInfo.google_token;

  const userInfo = await User.findOneAndUpdate({ username: username }, updates, { new: true });

  return userInfo;
};

export const followUser = async (username, usernameToFollow) => {
  await User.findOneAndUpdate({ username: usernameToFollow }, { $addToSet: { followers: username } });
  await User.findOneAndUpdate({ username: username }, { $addToSet: { following: usernameToFollow } }, { new: true });
};

export const unFollowUser = async (username, usernameToUnFollow) => {
  await User.findOneAndUpdate({ username: usernameToUnFollow }, { $pull: { followers: username } });
  await User.findOneAndUpdate({ username: username }, { $pull: { following: usernameToUnFollow } });
};

export const getAllUsers = async () => {
  return await UserInfo.find({});
};

export const getUserMeta = async (username) => {
  return await UserInfo.findOne({ username: username });
};

export const createUserMeta = async (data) => {
  return await UserInfo.create(data);
};

export const updateUserMeta = async (username, updateInfo) => {
  let updates = {};
  if (updateInfo.work) updates['work'] = updateInfo.work;
  if (updateInfo.tagline) updates['tagline'] = updateInfo.tagline;
  if (updateInfo.image) updates['image'] = updateInfo.image;
  if (updateInfo.display_name) updates['display_name'] = updateInfo.display_name;

  const userInfo = await UserInfo.findOneAndUpdate({ username: username }, updates, { new: true });

  // await metaUpdateActivity(username, updateInfo);

  return userInfo;
};

export const getUsersMeta = async (usernames) => {
  return await UserInfo.find({
    username: { $in: usernames },
  });
};

export const getFollowers = async (username) => {
  const user = await User.findOne({ username: username });

  return await UserInfo.find({
    username: { $in: user.followers },
  });
};

export const getFollowing = async (username) => {
  const user = await User.findOne({ username: username });

  return await UserInfo.find({
    username: { $in: user.following },
  });
};

const metaUpdateActivity = async (username, updateInfo) => {
  let data;
  if (updateInfo.image) {
    data = {
      username: username,
      summary: 'changed their picture! WOW!',
      extraImages: [updateInfo.image],
    };
    await activityService.createActivity(data);
  }
  if (updateInfo.tagline) {
    data = {
      username: username,
      summary: 'changed their tagline',
      extraText: updateInfo.tagline,
    };
    await activityService.createActivity(data);
  }
  if (updateInfo.work) {
    data = {
      username: username,
      summary: 'changed their work status! Impressive!',
      extraText: updateInfo.work,
    };
    await activityService.createActivity(data);
  }
};
