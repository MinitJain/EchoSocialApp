import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import LeftSidebar from "./LeftSidebar";
import RightSideBar from "./RightSideBar";
import MobileNav from "./MobileNav";
import AIChatBot from "./AIChatBot";
import useOtherUsers from "../hooks/useOtherUsers";
import useGetTweets from "../hooks/useGetTweets";
import ScrollFade from "./ui/scrollFade";

const Home = () => {
  const { user, otherUsers } = useSelector((store) => store.user);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isAIMinimized, setIsAIMinimized] = useState(false);

  useOtherUsers(user?._id);
  useGetTweets(user?._id);

  const handleAIClose = () => {
    setIsAIMinimized(true);
  };

  const handleAIOpen = () => {
    setIsAIChatOpen(true);
    setIsAIMinimized(false);
  };

  return (
    <>
      <div className="h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto flex h-full max-w-6xl gap-6 px-4 lg:px-8">
          <LeftSidebar isAIChatOpen={isAIChatOpen} setIsAIChatOpen={handleAIOpen} />

          <main className="flex-1 w-full max-w-2xl overflow-y-auto pr-2 ">
            <Outlet />
            <ScrollFade />
          </main>

          <RightSideBar otherUsers={otherUsers} />
        </div>
      </div>

      <MobileNav isAIChatOpen={isAIChatOpen} setIsAIChatOpen={handleAIOpen} />
      <AIChatBot 
        isOpen={isAIChatOpen} 
        onClose={handleAIClose}
        isMinimized={isAIMinimized}
        onOpen={handleAIOpen}
      />
    </>
  );
};

export default Home;
