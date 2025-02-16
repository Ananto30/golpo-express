import mongoose from 'mongoose';

const { Schema } = mongoose;

const activitySchema = new Schema(
  {
    username: String,
    summary: String,
    link: String,
    date: Date,
    extra_text: String,
    extra_images: [String],
  },
  { collection: 'activity' }, // TODO: should be removed, need to fix mongo model
);

export const Activity = mongoose.model('Activity', activitySchema);
