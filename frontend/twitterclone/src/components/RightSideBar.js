import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { followingUpdate } from "../redux/userSlice";
import { getRefresh } from "../redux/tweetSlice";
import toast from "react-hot-toast";

const RightSideBar = ({ otherUsers }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);

  const handleFollowToggle = async (userToFollowId) => {
    try {
      const isFollowing = user.following.includes(userToFollowId);
      const endpoint = isFollowing ? "unfollow" : "follow";

      const res = await axios.post(
        `${USER_API_END_POINT}/${endpoint}/${userToFollowId}`,
        { id: user?._id },
        { withCredentials: true },
      );

      if (res.data.success) {
        dispatch(followingUpdate(userToFollowId));
        dispatch(getRefresh());
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      const filtered = otherUsers.filter(
        (otherUser) =>
          otherUser.name.toLowerCase().includes(query.toLowerCase()) ||
          otherUser.username.toLowerCase().includes(query.toLowerCase()),
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="hidden lg:block w-[320px] pl-8 pt-6 sticky top-6 self-start">
      {/* SEARCH */}
      <div className="relative mb-6">
        <CiSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
          size={20}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search users..."
          className="
            w-full py-3 pl-12 pr-4
            rounded-2xl
            bg-zinc-100 dark:bg-zinc-800
            text-zinc-900 dark:text-zinc-100
            placeholder-zinc-500 dark:placeholder-zinc-400
            border border-transparent
            focus:border-zinc-300 dark:focus:border-zinc-700
            focus:outline-none
            transition-all
          "
        />
      </div>

      {/* SEARCH RESULTS */}
      {searchQuery && searchResults.length > 0 && (
        <div
          className="
          mb-6 p-5 rounded-2xl
          bg-white dark:bg-zinc-900
          border border-zinc-200 dark:border-zinc-800
          shadow-md dark:shadow-black/30
        "
        >
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Search Results
          </h2>

          <div className="space-y-3">
            {searchResults.map((otherUser) => (
              <div
                key={otherUser._id}
                className="
                  flex items-center justify-between
                  px-3 py-2.5 rounded-xl
                  hover:bg-zinc-100 dark:hover:bg-zinc-800
                  transition-all duration-200
                "
              >
                <Link
                  to={`/profile/${otherUser._id}`}
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  {otherUser?.profileImageUrl ? (
                    <img
                      src={otherUser.profileImageUrl}
                      alt={otherUser.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-zinc-800"
                    />
                  ) : (
                    <Avatar
                      name={otherUser?.name || "User"}
                      size="40"
                      round
                      className="ring-2 ring-white dark:ring-zinc-800"
                    />
                  )}

                  <div className="min-w-0">
                    <h3 className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">
                      {otherUser.name}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                      @{otherUser.username}
                    </p>
                  </div>
                </Link>

                <Link to={`/profile/${otherUser._id}`}>
                  <button
                    className="
                    px-3 py-1.5 text-sm font-medium rounded-lg
                    bg-zinc-900 text-white hover:bg-black
                    dark:bg-zinc-100 dark:text-black dark:hover:bg-white
                    transition-all duration-200
                  "
                  >
                    View
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUGGESTED */}
      <div
        className="
        p-5 rounded-2xl
        bg-white dark:bg-zinc-900
        border border-zinc-200 dark:border-zinc-800
        shadow-md dark:shadow-black/30
      "
      >
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Suggested for You
        </h2>

        {otherUsers && otherUsers.length > 0 ? (
          <div className="space-y-3">
            {otherUsers.map((otherUser) => {
              const isFollowing = user.following.includes(otherUser._id);

              return (
                <div
                  key={otherUser._id}
                  className="
                    flex items-center justify-between
                    px-1 py-3.5 rounded-xl
                    hover:bg-zinc-100 dark:hover:bg-zinc-800
                    transition-all duration-200
                  "
                >
                  <Link
                    to={`/profile/${otherUser._id}`}
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    {otherUser?.profileImageUrl ? (
                      <img
                        src={otherUser.profileImageUrl}
                        alt={otherUser.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-zinc-800"
                      />
                    ) : (
                      <Avatar
                        name={otherUser?.name || "User"}
                        size="40"
                        round
                        className="ring-2 ring-white dark:ring-zinc-800"
                      />
                    )}

                    <div className="min-w-0">
                      <h3 className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">
                        {otherUser.name}
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                        @{otherUser.username}
                      </p>
                    </div>
                  </Link>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleFollowToggle(otherUser._id);
                    }}
                    className={`
                      px-3 py-1.5 text-sm font-medium rounded-lg
                      transition-all duration-200
                      ${
                        isFollowing
                          ? "bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
                          : "bg-zinc-900 text-white hover:bg-black dark:bg-zinc-100 dark:text-black dark:hover:bg-white"
                      }
                    `}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-6">
            No users found
          </p>
        )}
      </div>
    </div>
  );
};

export default RightSideBar;
