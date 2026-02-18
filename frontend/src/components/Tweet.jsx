import { useState } from "react";
import Avatar from "react-avatar";
import { RiHeart3Line, RiHeart3Fill, RiBookmarkLine } from "react-icons/ri";
import { MdDeleteOutline } from "react-icons/md";
import API from "../api/axios";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getRefresh } from "../redux/tweetSlice";
import { bookmarkUpdate } from "../redux/userSlice";
import { Link } from "react-router-dom";

const Tweet = ({ tweet }) => {
  const { user } = useSelector((store) => store.user);
  const [likes, setLikes] = useState(tweet?.likes || []);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tweetToDelete, setTweetToDelete] = useState(null);
  const dispatch = useDispatch();

  const tweetUser = tweet?.userId;

  const likeOrDislikeHandler = async (id) => {
    try {
      const alreadyLiked = likes.includes(user?._id);
      const updatedLikes = alreadyLiked
        ? likes.filter((uid) => uid !== user._id)
        : [...likes, user._id];

      setLikes(updatedLikes);

      const res = await API.put(`/api/v1/tweet/like/${id}`, { id: user?._id });
      if (res.data.success) dispatch(getRefresh());
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const deleteTweetHandler = async (id) => {
    try {
      const res = await API.delete(`/api/v1/tweet/delete/${id}`);
      if (res.data.success) {
        toast.success("Tweet deleted successfully!");
        dispatch(getRefresh());
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete tweet");
    }
  };

  const bookmarkHandler = async (tweetId) => {
    if (!user) {
      toast.error("Please login to bookmark tweets");
      return;
    }

    try {
      dispatch(bookmarkUpdate(tweetId));
      const res = await API.put(`/api/v1/user/bookmark/${tweetId}`, {
        id: user?._id,
      });

      if (res.data.success) dispatch(getRefresh());
    } catch (error) {
      dispatch(bookmarkUpdate(tweetId));
      toast.error(error.response?.data?.message || "Failed to bookmark tweet");
    }
  };

  return (
    <>
      <div
        className="
        my-3
        rounded-xl border border-zinc-200 bg-white/95
        shadow-sm transition-all duration-150 ease-out
        hover:-translate-y-0.5 hover:shadow-md
        dark:border-zinc-800 dark:bg-zinc-900/95
        "
      >
        <div className="flex gap-3 px-4 py-4 sm:px-5 sm:py-4">
          {/* Avatar */}
          <Link to={`/profile/${tweetUser?._id}`}>
            <div className="flex-shrink-0">
              {tweetUser?.profileImageUrl ? (
                <img
                  src={tweetUser.profileImageUrl}
                  alt={tweetUser.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-white dark:ring-zinc-800"
                />
              ) : (
                <Avatar
                  name={tweetUser?.name || "User"}
                  size="44"
                  round
                  className="ring-2 ring-white dark:ring-zinc-800"
                />
              )}
            </div>
          </Link>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <Link to={`/profile/${tweetUser?._id}`}>
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {tweetUser?.name}
                </h2>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  @{tweetUser?.username}
                </span>
              </Link>
            </div>

            {/* Content */}
            <div className="mb-3">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-900 dark:text-zinc-100">
                {tweet?.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-5 pt-1.5">
              {/* Like */}
              <button
                onClick={() => likeOrDislikeHandler(tweet?._id)}
                className="
                flex items-center gap-1.5 rounded-full px-3 py-1.5
                transition-all duration-150 ease-out
                hover:bg-red-50 dark:hover:bg-red-500/10
                active:scale-95
                "
              >
                {likes.includes(user?._id) ? (
                  <RiHeart3Fill size={18} className="text-red-500" />
                ) : (
                  <RiHeart3Line size={18} className="text-zinc-500" />
                )}
                <span
                  className={`text-xs ${
                    likes.includes(user?._id) ? "text-red-500" : "text-zinc-500"
                  }`}
                >
                  {likes.length}
                </span>
              </button>

              {/* Bookmark */}
              <button
                onClick={() => bookmarkHandler(tweet?._id)}
                className="
                flex items-center gap-1.5 rounded-full px-3 py-1.5
                transition-all duration-150 ease-out
                hover:bg-indigo-50 dark:hover:bg-indigo-500/10
                active:scale-95
                "
              >
                <RiBookmarkLine
                  size={18}
                  className={
                    user?.bookmarks?.includes(tweet?._id)
                      ? "text-blue-500"
                      : "text-zinc-500"
                  }
                />
                <span
                  className={`text-xs ${
                    user?.bookmarks?.includes(tweet?._id)
                      ? "text-indigo-600"
                      : "text-zinc-500"
                  }`}
                >
                  {user?.bookmarks?.includes(tweet?._id) ? "Saved" : "Save"}
                </span>
              </button>

              {/* Delete */}
              {user?._id === tweetUser?._id && (
                <button
                  onClick={() => {
                    setTweetToDelete(tweet._id);
                    setShowDeleteConfirm(true);
                  }}
                  className="
                  flex items-center gap-1.5 rounded-full px-3 py-1.5
                  transition-all duration-150 ease-out
                  hover:bg-red-50 dark:hover:bg-red-500/10
                  active:scale-95
                  "
                >
                  <MdDeleteOutline size={18} className="text-zinc-500" />
                  <span className="text-sm text-zinc-500">Delete</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white/95 shadow-lg dark:border-zinc-800 dark:bg-zinc-900/95">
            <div className="px-5 py-4 sm:px-6 sm:py-5">
              <h2 className="mb-1 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                Delete Tweet?
              </h2>
              <p className="mb-5 text-sm text-zinc-600 dark:text-zinc-400">
                This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="
                  rounded-full border border-zinc-300 px-4 py-1.5 text-xs font-medium
                  text-zinc-700 transition-colors duration-150 ease-out
                  hover:bg-zinc-100
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-0
                  dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800
                  "
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    deleteTweetHandler(tweetToDelete);
                    setShowDeleteConfirm(false);
                  }}
                  className="
                  rounded-full bg-red-500 px-4 py-1.5 text-xs font-medium text-white
                  transition-colors duration-150 ease-out
                  hover:bg-red-600
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-0
                  "
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Tweet;
