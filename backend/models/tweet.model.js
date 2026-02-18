import mongoose from "mongoose";
// Defines tweet structure
const tweetSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId, // References the User model (creates a relationship)
      ref: "User", // Links to the User collection
      required: true,
    },
    userDetails: {
      type: Array,
      default: [],
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },

  { timestamps: true }
);

export const Tweet = mongoose.model("Tweet", tweetSchema);
