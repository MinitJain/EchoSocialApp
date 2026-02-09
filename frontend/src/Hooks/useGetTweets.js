import { useEffect, useCallback } from "react";
import axios from "axios";
import { TWEET_API_END_POINT } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { getAllTweets } from "../redux/tweetSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useGetTweets = (id) => {
  const { refresh, isActive } = useSelector((store) => store.tweet);
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user === null) return;
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const fetchTweets = useCallback(async () => {
    if (!user) return;

    try {
      const res = await axios.get(`${TWEET_API_END_POINT}/allTweets`, {
        withCredentials: true,
      });
      dispatch(getAllTweets(res.data.tweets));
    } catch (error) {
      console.log("Failed to fetch tweets:", error);
    }
  }, [dispatch, user]);

  const followingTweetHandler = useCallback(async () => {
    if (!user) return;

    try {
      const res = await axios.get(
        `${TWEET_API_END_POINT}/followingtweets/${id}`,
        { withCredentials: true },
      );

      if (res.data.success) {
        dispatch(getAllTweets(res.data.tweets));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch following user's tweets",
      );
    }
  }, [id, dispatch, user]);

  useEffect(() => {
    if (!user) return;

    if (isActive) {
      followingTweetHandler();
    } else {
      fetchTweets();
    }
  }, [refresh, isActive, fetchTweets, followingTweetHandler, user]);
};

export default useGetTweets;
