const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const tags = require('../constants');

const postSchema = new Schema(
  {
    author: String,
    text: String,
    date: Date, //TODO: make it created_at
    updated_at: { type: Date, default: Date.now },
    comments: [
      {
        author: String,
        text: String,
        date: Date,
      },
    ],
    loves: [
      {
        author: String
      }
    ],
    tags: {type: [String], enum: tags}
  },
  { collection: "post" } // TODO: should be removed, need to fix mongo model
);

module.exports = {
  Post: mongoose.model("Post", postSchema),
};
