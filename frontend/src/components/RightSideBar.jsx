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
import ScrollFade from "./ui/scrollFade";

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
    <aside className="hidden lg:block w-80 pl-6">
      {/* Sticky Scroll Container */}
      <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto pr-2">
        <div className="space-y-5 pb-24">
          {/* SEARCH */}
          <div className="relative">
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
                w-full rounded-lg border border-zinc-200 bg-zinc-100 py-2.5 pl-11 pr-3 text-sm
                text-zinc-900 placeholder-zinc-500
                outline-none transition-colors duration-150 ease-out
                focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500
                dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500
                dark:focus:border-indigo-400 dark:focus:bg-zinc-950 dark:focus:ring-indigo-400
              "
            />
          </div>

          {/* SEARCH RESULTS */}
          {searchQuery && searchResults.length > 0 && (
            <div className="rounded-xl border border-zinc-200 bg-white/90 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/90">
              <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Search Results
              </h2>

              <div className="space-y-3">
                {searchResults.map((otherUser) => (
                  <Link
                    key={otherUser._id}
                    to={`/profile/${otherUser._id}`}
                    className="flex items-center gap-3 rounded-lg px-2.5 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
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
                      <h3 className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {otherUser.name}
                      </h3>
                      <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                        @{otherUser.username}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* SUGGESTED USERS */}
          <div className="rounded-xl border border-zinc-200 bg-white/90 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/90">
            <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Suggested for You
            </h2>

            {otherUsers?.length ? (
              <div className="space-y-3">
                {otherUsers.map((otherUser) => {
                  const isFollowing = user.following.includes(otherUser._id);

                  return (
                    <div
                      key={otherUser._id}
                      className="flex items-center justify-between rounded-lg px-1.5 py-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <Link
                        to={`/profile/${otherUser._id}`}
                        className="flex items-center gap-3 min-w-0"
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
                          <h3 className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {otherUser.name}
                          </h3>
                          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                            @{otherUser.username}
                          </p>
                        </div>
                      </Link>

                      <button
                        onClick={() => handleFollowToggle(otherUser._id)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition
                          ${
                            isFollowing
                              ? "bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100"
                              : "bg-indigo-600 text-white hover:bg-indigo-500"
                          }`}
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

        <ScrollFade />
      </div>
    </aside>
  );
};

export default RightSideBar;
