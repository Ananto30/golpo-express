import mongoose from 'mongoose';
import { tags } from '../constants.js';

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    author: String,
    url: String,
    title: String,
    description: String,
    image: String,
    author_image: String,
    site_name: String,
    favicon: String,
    created_at: Date,
    updated_at: { type: Date, default: Date.now },
    comments: [
      {
        author: String,
        text: String,
        created_at: Date,
      },
    ],
    loves: [
      {
        author: String,
      },
    ],
    tags: { type: [String], enum: tags },
  },
  { collection: 'post' }, // TODO: should be removed, need to fix mongo model
);

export const Post = mongoose.model('Post', postSchema);
