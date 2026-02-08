import LeftSidebar from "./LeftSidebar";
import RightSideBar from "./RightSideBar";
import { Outlet } from "react-router-dom";
import useOtherUsers from "../Hooks/useOtherUsers";
import { useSelector } from "react-redux";
import useGetTweets from "../Hooks/useGetTweets";

const Home = () => {
  const { user, otherUsers } = useSelector((store) => store.user);

  useOtherUsers(user?._id);
  useGetTweets(user?._id);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-[1280px] mx-auto flex">
        <LeftSidebar />

        <main className="flex-1 max-w-[680px] border-x border-gray-200 dark:border-gray-800">
          <Outlet />
        </main>

        <RightSideBar otherUsers={otherUsers} />
      </div>
    </div>
  );
};

export default Home;
