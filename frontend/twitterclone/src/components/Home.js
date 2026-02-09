import LeftSidebar from "./LeftSidebar";
import RightSideBar from "./RightSideBar";
import { Outlet } from "react-router-dom";
import useOtherUsers from "../Hooks/useOtherUsers";
import { useSelector } from "react-redux";
import useGetTweets from "../Hooks/useGetTweets";
import MobileNav from "./MobileNav";
import { useState } from "react";
import CopilotHelper from "./CopilotHelper";

const Home = () => {
  const { user, otherUsers } = useSelector((store) => store.user);
  const [aiOpen, setAiOpen] = useState(false);

  useOtherUsers(user?._id);
  useGetTweets(user?._id);

  return (
    <>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors pb-20">
        <div className="max-w-[1200px] mx-auto flex px-4">
          <LeftSidebar onAIClick={() => setAiOpen(true)} />
          <main className="flex-1 max-w-[680px] w-full mx-auto px-4 sm:px-6 lg:px-0">
            <Outlet />
          </main>
          <RightSideBar otherUsers={otherUsers} />
        </div>
      </div>

      <MobileNav onAIClick={() => setAiOpen(true)} />

      <CopilotHelper open={aiOpen} setOpen={setAiOpen} />
    </>
  );
};

export default Home;
