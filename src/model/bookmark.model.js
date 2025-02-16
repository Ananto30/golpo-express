import mongoose from 'mongoose';

const { Schema } = mongoose;

const bookmarkPostSchema = new Schema({
  username: String,
  post_ids: [mongoose.Types.ObjectId],
});

export const BookmarkPost = mongoose.model('BookmarkPost', bookmarkPostSchema);
