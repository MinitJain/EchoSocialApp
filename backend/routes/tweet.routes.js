import express from "express";
import {
  createTweet,
  deleteTweet,
  getAllTweets,
  getFollowingTweets,
  getTweetById,
  likeorDislikeTweet,
} from "../controllers/tweet.controller.js";
import isAuthenticated from "../config/auth.js";

const router = express.Router();

router.post("/create", isAuthenticated, createTweet);
router.delete("/delete/:id", isAuthenticated, deleteTweet);
router.put("/like/:id", isAuthenticated, likeorDislikeTweet);
router.get("/allTweets", isAuthenticated, getAllTweets);
router.get("/followingtweets/:id", isAuthenticated, getFollowingTweets);
router.get("/tweet/:id", isAuthenticated, getTweetById);

export default router;
