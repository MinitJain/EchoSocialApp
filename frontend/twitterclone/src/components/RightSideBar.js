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
      console.error("Follow/Unfollow error:", error);
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
    <div className="hidden xl:flex w-[320px] flex-col min-h-screen px-6 py-8 border-l border-gray-200 dark:border-gray-800">
      {/* Search Box */}
      <div className="relative mb-6">
        <CiSearch
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
          size={20}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search users..."
          className="w-full py-3.5 pl-12 pr-4 bg-gray-50 text-gray-900 placeholder-gray-500 rounded-2xl border border-transparent focus:border-gray-200 focus:bg-white focus:ring-0 focus:outline-none transition-all duration-200 text-[15px] font-medium"
        />
      </div>

      {/* Search Results */}
      {searchQuery && searchResults.length > 0 && (
        <div className="mb-6 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 tracking-[-0.01em]">
            Search Results
          </h2>
          <div className="space-y-3">
            {searchResults.map((otherUser) => (
              <div
                key={otherUser._id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-all duration-200 group gap-3"
              >
                <div className="flex items-center min-w-0 flex-1">
                  <div className="flex-shrink-0">
                    {otherUser?.profileImageUrl ? (
                      <img
                        src={otherUser.profileImageUrl}
                        alt={otherUser.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                      />
                    ) : (
                      <Avatar
                        name={otherUser?.name || "Guest"}
                        size="48"
                        round={true}
                        className="ring-2 ring-white shadow-sm"
                      />
                    )}
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-[15px] tracking-[-0.01em] truncate">
                      {otherUser.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      @{otherUser.username}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/profile/${otherUser._id}`}
                  className="flex-shrink-0"
                >
                  <button className="bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 active:scale-[0.98] tracking-[-0.01em]">
                    View
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested for You */}
      <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 tracking-[-0.01em]">
          Suggested for You
        </h2>
        {otherUsers && otherUsers.length > 0 ? (
          <div className="space-y-3">
            {otherUsers.map((otherUser) => (
              <div
                key={otherUser._id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-all duration-200 group gap-3"
              >
                <Link
                  to={`/profile/${otherUser._id}`}
                  className="flex items-center min-w-0 flex-1"
                >
                  <div className="flex-shrink-0">
                    {otherUser?.profileImageUrl ? (
                      <img
                        src={otherUser.profileImageUrl}
                        alt={otherUser.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                      />
                    ) : (
                      <Avatar
                        name={otherUser?.name || "Guest"}
                        size="48"
                        round={true}
                        className="ring-2 ring-white shadow-sm"
                      />
                    )}
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-[15px] tracking-[-0.01em] group-hover:text-gray-700 transition-colors truncate">
                      {otherUser.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      @{otherUser.username}
                    </p>
                  </div>
                </Link>

                <div className="flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleFollowToggle(otherUser._id);
                    }}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 active:scale-[0.98] tracking-[-0.01em] ${
                      user.following.includes(otherUser._id)
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                  >
                    {user.following.includes(otherUser._id)
                      ? "Following"
                      : "Follow"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-[15px]">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightSideBar;
