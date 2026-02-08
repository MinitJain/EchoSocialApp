import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import Tweet from "./Tweet";
import { useEffect, useState } from "react";

const Bookmarks = () => {
  const { user } = useSelector((store) => store.user);
  const { tweets } = useSelector((store) => store.tweet);

  const [localBookmarks, setLocalBookmarks] = useState([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && tweets?.length && user?.bookmarks) {
      const initialBookmarks = tweets.filter((tweet) =>
        user.bookmarks.includes(tweet._id),
      );

      setLocalBookmarks(initialBookmarks);
      setInitialized(true);
    }
  }, [tweets, user, initialized]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-4 px-6 py-4">
          <Link
            to="/"
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <IoMdArrowBack size={22} />
          </Link>

          <div>
            <h1 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
              Bookmarks
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {localBookmarks.length} saved
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-2">
        {localBookmarks.length > 0 ? (
          localBookmarks.map((tweet) => <Tweet key={tweet._id} tweet={tweet} />)
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              No bookmarks yet
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
              When you save tweets, they’ll appear here so you can easily find
              them later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
