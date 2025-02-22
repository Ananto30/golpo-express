import mongoose from 'mongoose';
import config from '../config.js';
import { Post } from '../model/post.model.js';

mongoose.connect(config.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const deleteDuplicateComments = async () => {
  try {
    const posts = await Post.find({});
    for (const post of posts) {
      const comments = post.comments;
      if (comments.length === 0) {
        continue;
      }

      const uniqueComments = new Map();

      // sort comments by created_at
      comments.sort((a, b) => b.created_at - a.created_at);

      comments.forEach((comment) => {
        const key = `${comment.author}-${comment.text}`;
        if (!uniqueComments.has(key) || uniqueComments.get(key).created_at < comment.created_at) {
          uniqueComments.set(key, comment);
        }
      });

      post.comments = Array.from(uniqueComments.values());
      await post.save();
    }
    console.log('Duplicate comments deleted successfully');
  } catch (err) {
    console.error('Error deleting duplicate comments:', err);
  } finally {
    mongoose.disconnect();
  }
};

// deleteDuplicateComments();

const printDuplicateComments = async () => {
  try {
    const posts = await Post.find({});
    for (const post of posts) {
      const comments = post.comments;
      if (comments.length === 0) {
        continue;
      }

      const uniqueComments = new Map();
      const duplicateComments = [];

      // sort comments by created_at
      comments.sort((a, b) => b.created_at - a.created_at);

      comments.forEach((comment) => {
        const key = `${comment.author}-${comment.text}`;
        if (!uniqueComments.has(key)) {
          uniqueComments.set(key, comment);
        } else {
          if (uniqueComments.get(key).created_at < comment.created_at) {
            uniqueComments.set(key, comment);
          }
          duplicateComments.push(comment);
        }
      });

      if (duplicateComments.length > 0) {
        console.log(`Duplicate comments found in post ${post._id}:`);
        duplicateComments.forEach((comment) => {
          console.log(comment);
        });
      }
    }
  } catch (err) {
    console.error('Error printing duplicate comments:', err);
  } finally {
    mongoose.disconnect();
  }
};

printDuplicateComments();
