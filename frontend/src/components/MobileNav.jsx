import {
  RiHome5Line,
  RiBookmarkLine,
  RiUser3Line,
  RiRobot2Line,
} from "react-icons/ri";
import { NavLink } from "react-router-dom";

const MobileNav = ({ onAIClick }) => {
  return (
    <nav
      className="
      md:hidden
      fixed bottom-0 left-0 right-0
      bg-white dark:bg-zinc-950
      border-t border-zinc-200 dark:border-zinc-800
      flex justify-around items-center
      h-16
      z-40
      "
    >
      <NavLink
        to="/"
        className="flex flex-col items-center text-zinc-600 dark:text-zinc-400"
      >
        <RiHome5Line size={22} />
      </NavLink>

      <NavLink
        to="/bookmarks"
        className="flex flex-col items-center text-zinc-600 dark:text-zinc-400"
      >
        <RiBookmarkLine size={22} />
      </NavLink>

      {/* 🔥 Elevated AI Button */}
      <button
        onClick={onAIClick}
        className="
        -mt-8
        w-14 h-14
        flex items-center justify-center
        rounded-full
        bg-zinc-900 text-white
        dark:bg-zinc-100 dark:text-black
        shadow-xl
        transition-all duration-200
        active:scale-95
        "
      >
        <RiRobot2Line size={26} />
      </button>

      <NavLink
        to="/profile/me"
        className="flex flex-col items-center text-zinc-600 dark:text-zinc-400"
      >
        <RiUser3Line size={22} />
      </NavLink>
    </nav>
  );
};

export default MobileNav;
