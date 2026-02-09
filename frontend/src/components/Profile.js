import Avatar from "react-avatar";
import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import useGetProfile from "../Hooks/useGetProfile";
import useGetTweets from "../Hooks/useGetTweets";
import API from "../api/axios";
import { followingUpdate } from "../redux/userSlice";
import { getRefresh } from "../redux/tweetSlice";
import EditProfile from "./EditProfile";
import Tweet from "./Tweet";

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { user, profile } = useSelector((store) => store.user);
  const { tweets } = useSelector((store) => store.tweet);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  useGetProfile(id);
  useGetTweets(user?._id);

  if (!profile) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <p className="text-zinc-500 dark:text-zinc-400">Loading profile...</p>
      </div>
    );
  }

  const isOwnProfile = profile?._id === user?._id;
  const isFollowing = user?.following?.includes(profile?._id);

  const followAndUnfollowHandler = async () => {
    try {
      const endpoint = isFollowing ? "unfollow" : "follow";

      await API.post(`/api/v1/user/${endpoint}/${profile._id}`, {
        id: user?._id,
      });

      dispatch(followingUpdate(profile._id));
      dispatch(getRefresh());
    } catch (error) {
      console.log(error);
    }
  };

  const userTweets = tweets?.filter(
    (tweet) => tweet.userId?._id === profile._id,
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4">
        <Link
          to="/"
          className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
        >
          <IoMdArrowBack size={22} />
        </Link>

        <h1 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
          {profile.name}
        </h1>
      </div>

      {/* Banner */}
      <div className="relative">
        <div className="w-full h-44 sm:h-52 overflow-hidden">
          <img
            src={
              profile?.bannerUrl ||
              "https://placehold.co/600x200?text=Profile+Banner"
            }
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Avatar */}
        <div className="absolute -bottom-12 left-6">
          {profile?.profileImageUrl ? (
            <img
              src={profile.profileImageUrl}
              alt="Profile"
              className="
                w-24 h-24 sm:w-28 sm:h-28
                rounded-full object-cover
                ring-2 ring-white dark:ring-zinc-950
                shadow-xl
              "
            />
          ) : (
            <Avatar
              name={profile?.name}
              size="112"
              round
              className="ring-2 ring-white dark:ring-zinc-950 shadow-xl"
            />
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end mt-16 px-6">
        {isOwnProfile ? (
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="
              px-5 py-2 rounded-full
              border border-zinc-300 dark:border-zinc-700
              text-zinc-900 dark:text-zinc-100
              hover:bg-zinc-100 dark:hover:bg-zinc-800
              transition
            "
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={followAndUnfollowHandler}
            className={`
              px-5 py-2 rounded-full font-medium transition
              ${
                isFollowing
                  ? "bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
                  : "bg-zinc-900 text-white hover:bg-black dark:bg-zinc-100 dark:text-black dark:hover:bg-white"
              }
            `}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-6 mt-4 pb-6">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          {profile.name}
        </h2>

        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          @{profile.username}
        </p>

        {profile.bio && profile.bio.trim() !== "" && (
          <p className="mt-4 text-sm text-zinc-800 dark:text-zinc-300 leading-relaxed">
            {profile.bio}
          </p>
        )}

        <div className="flex gap-6 mt-4 text-sm">
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {profile.following?.length || 0}{" "}
            <span className="text-zinc-500 dark:text-zinc-400 font-normal">
              Following
            </span>
          </span>

          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {profile.followers?.length || 0}{" "}
            <span className="text-zinc-500 dark:text-zinc-400 font-normal">
              Followers
            </span>
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-zinc-200 dark:border-zinc-800" />

      {/* Tweets Section */}
      <div className="mt-2">
        {userTweets && userTweets.length > 0 ? (
          userTweets.map((tweet) => <Tweet key={tweet._id} tweet={tweet} />)
        ) : (
          <div className="py-12 text-center text-zinc-500 dark:text-zinc-400 text-sm">
            No tweets yet.
          </div>
        )}
      </div>

      <EditProfile
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </div>
  );
};

export default Profile;
