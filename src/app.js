import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import authRouter from './routes/auth.js';
import postRouter from './routes/post.js';
import chatRouter from './routes/chat.js';
import userRouter from './routes/user.js';
import activityRouter from './routes/activity.js';
import notificationRouter from './routes/notification.js';

import config from './config.js';

const app = express();

function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== 'development') {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}

if (process.env.NODE_ENV == 'production') {
  app.use(requireHTTPS);
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(cors());

mongoose.connect(config.mongoUrl);

app.use('/api/auth', authRouter);
app.use('/api/post', postRouter);
app.use('/api/chat', chatRouter);
app.use('/api/user', userRouter);
app.use('/api/activity', activityRouter);
app.use('/api/notification', notificationRouter);

export default app;
