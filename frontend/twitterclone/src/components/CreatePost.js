import { useState } from "react";
import Avatar from "react-avatar";
import { TWEET_API_END_POINT } from "../utils/constant";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getIsActive, getRefresh } from "../redux/tweetSlice";

const CreatePost = () => {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((store) => store.user);
  const { isActive } = useSelector((store) => store.tweet);
  const dispatch = useDispatch();

  const submitHandler = async () => {
    if (!description.trim()) {
      toast.error("Tweet cannot be empty!");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${TWEET_API_END_POINT}/create`,
        { description, id: user?._id },
        { withCredentials: true },
      );

      if (res.data.success) {
        dispatch(getRefresh());
        toast.success(res.data.message);
        setDescription("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const followingHandler = () => dispatch(getIsActive(true));
  const forYouHandler = () => dispatch(getIsActive(false));

  return (
    <>
      {/* Tabs */}
      <div
        className="
        sticky top-0 z-10
        bg-white/80 dark:bg-zinc-900/80
        backdrop-blur-md
        border-b border-zinc-200 dark:border-zinc-800
      "
      >
        <div className="flex">
          <button
            onClick={forYouHandler}
            className={`
              flex-1 py-4 text-center relative transition-all
              ${
                !isActive
                  ? "text-zinc-900 dark:text-zinc-100 font-semibold"
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }
            `}
          >
            For You
            {!isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-900 dark:bg-zinc-500 rounded-full" />
            )}
          </button>

          <button
            onClick={followingHandler}
            className={`
              flex-1 py-4 text-center relative transition-all
              ${
                isActive
                  ? "text-zinc-900 dark:text-zinc-100 font-semibold"
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }
            `}
          >
            Following
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-900 dark:bg-zinc-500 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Compose Card */}
      <div
        className="mx-2 my-4 p-5 rounded-2xl
  bg-white dark:bg-zinc-900
  border border-zinc-200 dark:border-zinc-800
  shadow-sm hover:shadow-lg dark:hover:shadow-black/30
  transition-all duration-200
      "
      >
        <div className="flex gap-4">
          {/* Avatar */}
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-white dark:ring-zinc-800"
            />
          ) : (
            <Avatar
              name={user?.name || "User"}
              size="44"
              round
              className="ring-2 ring-white dark:ring-zinc-800"
            />
          )}

          <div className="flex-1">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's happening?"
              rows={3}
              className="
                w-full resize-none
                bg-zinc-100 dark:bg-zinc-800
                text-zinc-900 dark:text-zinc-100
                placeholder-zinc-500 dark:placeholder-zinc-400
                p-4 rounded-2xl
                border border-transparent
                focus:border-zinc-300 dark:focus:border-zinc-700
                focus:outline-none
                transition-all
                text-[16px] leading-relaxed
              "
            />

            <div className="flex justify-end mt-4">
              <button
                onClick={submitHandler}
                disabled={loading || !description.trim()}
                className={`
                  px-5 py-2.5 rounded-full text-sm font-medium
                  transition-all duration-200
                  ${
                    loading || !description.trim()
                      ? "bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500 cursor-not-allowed"
                      : "bg-zinc-900 text-white hover:bg-black dark:bg-zinc-100 dark:text-black dark:hover:bg-white"
                  }
                `}
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
