import { google } from 'googleapis';
import config from '../config.js';
import jwt from 'jsonwebtoken';
import * as userService from './user.service.js';

const oauth2 = google.oauth2('v2');
const oauth2Client = new google.auth.OAuth2(config.googleClientID, config.googleClientSecret, config.googleCallbackUrl);

const scopes = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'];

export const getGoogleAuthUrl = async () => {
  return oauth2Client.generateAuthUrl({
    scope: scopes,
  });
};

export const getTokenByGoogleCode = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  let googleUser = await oauth2.userinfo.get({
    auth: oauth2Client,
  });

  let user = await userService.getUserByGoogleMail(googleUser.data.email);

  if (!user) {
    const profileData = googleUser.data;
    const data = {
      username: profileData.email.split('@')[0],
      google_id: profileData.id,
      google_email: profileData.email,
      google_name: profileData.name,
      google_picture: profileData.picture,
    };
    user = await userService.createUser(data);
    await userService.createUserMeta({
      username: user.username,
      image: user.google_picture,
      display_name: user.google_name,
    });
  } else {
    await userService.updateUserMeta(user.username, {
      image: user.google_picture,
      display_name: user.google_name,
    });
  }

  return jwt.sign({ username: user.username }, config.jwtSecret, {
    expiresIn: config.jwtExpiration,
  });
};
