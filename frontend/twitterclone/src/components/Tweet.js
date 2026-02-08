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
        mx-2 my-3
        p-5
        rounded-2xl
        bg-white dark:bg-zinc-900
        border border-zinc-200 dark:border-zinc-800
        shadow-sm hover:shadow-md
        transition-all duration-200
        "
      >
        <div className="flex gap-4">
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
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 text-[15px]">
                  {tweetUser?.name}
                </h2>
                <span className="text-zinc-500 dark:text-zinc-400 text-[14px]">
                  @{tweetUser?.username}
                </span>
              </Link>
            </div>

            {/* Content */}
            <div className="mb-4">
              <p className="text-zinc-900 dark:text-zinc-200 text-[15px] leading-relaxed whitespace-pre-wrap">
                {tweet?.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 pt-2">
              {/* Like */}
              <button
                onClick={() => likeOrDislikeHandler(tweet?._id)}
                className="
                flex items-center gap-1.5
                px-3 py-1.5
                rounded-full
                hover:bg-red-50 dark:hover:bg-red-500/10
                transition-all duration-200 active:scale-95
                "
              >
                {likes.includes(user?._id) ? (
                  <RiHeart3Fill size={18} className="text-red-500" />
                ) : (
                  <RiHeart3Line size={18} className="text-zinc-500" />
                )}
                <span
                  className={`text-sm ${
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
                flex items-center gap-1.5
                px-3 py-1.5
                rounded-full
                hover:bg-blue-50 dark:hover:bg-blue-500/10
                transition-all duration-200 active:scale-95
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
                  className={`text-sm ${
                    user?.bookmarks?.includes(tweet?._id)
                      ? "text-blue-500"
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
                  flex items-center gap-1.5
                  px-3 py-1.5
                  rounded-full
                  hover:bg-red-50 dark:hover:bg-red-500/10
                  transition-all duration-200 active:scale-95
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md border border-zinc-200 dark:border-zinc-800">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Delete Tweet?
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-[15px] mb-6">
                This action cannot be undone.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="
                  px-5 py-2 rounded-full
                  border border-zinc-300 dark:border-zinc-700
                  text-zinc-700 dark:text-zinc-300
                  hover:bg-zinc-100 dark:hover:bg-zinc-800
                  transition-all duration-200
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
                  px-5 py-2 rounded-full
                  bg-red-500 text-white
                  hover:bg-red-600
                  transition-all duration-200
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
