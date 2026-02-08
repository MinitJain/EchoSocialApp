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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      {/* Layout Wrapper */}
      <div className="max-w-[1280px] mx-auto flex gap-6 px-4">
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Center Column */}
        <main className="flex-1 max-w-[680px] w-full mx-auto">
          <Outlet />
        </main>

        {/* Right Sidebar */}
        <RightSideBar otherUsers={otherUsers} />
      </div>
    </div>
  );
};

export default Home;
