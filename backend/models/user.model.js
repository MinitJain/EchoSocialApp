import mongoose from "mongoose";

// Defines the structure of user data in your database
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // means Field must be provided
    },
    username: {
      type: String,
      required: true,
      unique: true, // means No two users can have the same value
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    followers: {
      type: Array,
      default: [], //If value (followers in this case) not provided, defaults to empty array
    },
    following: {
      type: Array,
      default: [], //If value not provided, defaults to empty array
    },
    bookmarks: {
      type: Array,
      default: [], //If value not provided, defaults to empty array
    },
    bio: {
      type: String,
      default: "",
      maxlength: 160,
    },
    profileImageUrl: {
      type: String,
      default: "",
    },
    bannerUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
