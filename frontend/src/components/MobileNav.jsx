import {
  RiHome5Line,
  RiBookmarkLine,
  RiUser3Line,
  RiRobotLine,
} from "react-icons/ri";
import { NavLink } from "react-router-dom";

const MobileNav = ({ isAIChatOpen, setIsAIChatOpen }) => {
  return (
    <nav
      className="
      md:hidden
      fixed bottom-0 left-0 right-0
      bg-zinc-50/95 dark:bg-zinc-950/95
      border-t border-zinc-200 dark:border-zinc-800
      flex justify-around items-center
      h-16
      z-40
      transition-colors
      "
    >
      <NavLink
        to="/"
        className="flex flex-col items-center text-zinc-500 dark:text-zinc-400 [&.active]:text-zinc-900 dark:[&.active]:text-zinc-50"
      >
        <RiHome5Line size={22} />
      </NavLink>

      <NavLink
        to="/bookmarks"
        className="flex flex-col items-center text-zinc-500 dark:text-zinc-400 [&.active]:text-zinc-900 dark:[&.active]:text-zinc-50"
      >
        <RiBookmarkLine size={22} />
      </NavLink>

      <button
        onClick={() => setIsAIChatOpen(!isAIChatOpen)}
        className={`flex flex-col items-center transition-colors ${
          isAIChatOpen
            ? "text-indigo-500"
            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
        }`}
        aria-label="Toggle Echo AI"
      >
        <RiRobotLine size={22} />
      </button>

      <NavLink
        to="/profile/me"
        className="flex flex-col items-center text-zinc-500 dark:text-zinc-400 [&.active]:text-zinc-900 dark:[&.active]:text-zinc-50"
      >
        <RiUser3Line size={22} />
      </NavLink>
    </nav>
  );
};

export default MobileNav;
