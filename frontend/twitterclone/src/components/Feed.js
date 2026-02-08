import CreatePost from "./CreatePost";
import Tweet from "./Tweet";
import { useSelector } from "react-redux";

const Feed = () => {
  const { tweets } = useSelector((store) => store.tweet);

  return (
    <div className="w-full">
      <CreatePost />
      {Array.isArray(tweets) && tweets.length > 0 ? (
        tweets.map((tweet) => <Tweet key={tweet._id} tweet={tweet} />)
      ) : (
        <p className="text-center text-gray-500">No tweets found</p>
      )}
    </div>
  );
};

export default Feed;
