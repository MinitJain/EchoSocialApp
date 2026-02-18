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
        border-b border-zinc-200 bg-white/90 backdrop-blur-sm
        dark:border-zinc-800 dark:bg-zinc-950/90
      "
      >
        <div className="flex">
          <button
            onClick={forYouHandler}
            className={`
              relative flex-1 py-3 text-center text-sm transition-colors duration-150 ease-out
              ${
                !isActive
                  ? "text-zinc-900 dark:text-zinc-100 font-semibold"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
              }
            `}
          >
            For You
            {!isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
            )}
          </button>

          <button
            onClick={followingHandler}
            className={`
              relative flex-1 py-3 text-center text-sm transition-colors duration-150 ease-out
              ${
                isActive
                  ? "text-zinc-900 dark:text-zinc-100 font-semibold"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
              }
            `}
          >
            Following
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
            )}
          </button>
        </div>
      </div>

      {/* Compose Card */}
      <div
        className="
        my-4 rounded-xl border border-zinc-200 bg-white/95
        shadow-sm transition-all duration-150 ease-out
        hover:-translate-y-0.5 hover:shadow-md
        dark:border-zinc-800 dark:bg-zinc-900/95
      "
      >
        <div className="flex gap-3 px-4 py-4 sm:px-5 sm:py-4">
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
                w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50
                p-3 text-sm leading-relaxed
                text-zinc-900 placeholder-zinc-500
                outline-none transition-colors duration-150 ease-out
                focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500
                dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500
                dark:focus:border-indigo-400 dark:focus:bg-zinc-950 dark:focus:ring-indigo-400
              "
            />

            <div className="flex justify-end mt-4">
              <button
                onClick={submitHandler}
                disabled={loading || !description.trim()}
                className={`
                  rounded-full px-4 py-2 text-xs font-medium
                  transition-transform transition-colors duration-150 ease-out
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-0
                  ${
                    loading || !description.trim()
                      ? "bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95"
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
