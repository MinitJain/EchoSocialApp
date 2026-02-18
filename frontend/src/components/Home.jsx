import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import LeftSidebar from "./LeftSidebar";
import RightSideBar from "./RightSideBar";
import MobileNav from "./MobileNav";
import useOtherUsers from "../hooks/useOtherUsers";
import useGetTweets from "../hooks/useGetTweets";
import ScrollFade from "./ui/scrollFade";

const Home = () => {
  const { user, otherUsers } = useSelector((store) => store.user);

  useOtherUsers(user?._id);
  useGetTweets(user?._id);

  return (
    <>
      <div className="h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto flex h-full max-w-6xl gap-6 px-4 lg:px-8">
          <LeftSidebar />

          <main className="flex-1 w-full max-w-2xl overflow-y-auto pr-2 ">
            <Outlet />
            <ScrollFade />
          </main>

          <RightSideBar otherUsers={otherUsers} />
        </div>
      </div>

      <MobileNav />
    </>
  );
};

export default Home;
