import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import logger from 'morgan';

import activityRouter from './api/activity.js';
import authRouter from './api/auth.js';
import chatRouter from './api/chat.js';
import notificationRouter from './api/notification.js';
import postRouter from './api/post.js';
import userRouter from './api/user.js';

import config from './src/config.js';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(
  cors({
    origin: ['https://golpo.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

mongoose.connect(config.mongoUrl);

app.use('/api/auth', authRouter);
app.use('/api/post', postRouter);
app.use('/api/chat', chatRouter);
app.use('/api/user', userRouter);
app.use('/api/activity', activityRouter);
app.use('/api/notification', notificationRouter);

export default app;
