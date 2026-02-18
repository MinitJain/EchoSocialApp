import {
  RiHome5Line,
  RiBookmarkLine,
  RiUser3Line,
  RiLogoutCircleLine,
  RiMoonClearLine,
  RiSunLine,
} from "react-icons/ri";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser, getOtherUsers, getMyProfile } from "../redux/userSlice";
import { toast } from "react-hot-toast";
import useTheme from "../hooks/useTheme";

const MobileNav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark, toggleTheme } = useTheme();

  const logoutHandler = async () => {
    try {
      localStorage.clear();
      dispatch(setUser(null));
      dispatch(getOtherUsers(null));
      dispatch(getMyProfile(null));

      await axios.get(`${import.meta.env.VITE_USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });

      toast.success("Logged out");
      navigate("/login", { replace: true });
    } catch {
      toast.error("Logout failed");
    }
  };

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

      <NavLink
        to="/profile/me"
        className="flex flex-col items-center text-zinc-500 dark:text-zinc-400 [&.active]:text-zinc-900 dark:[&.active]:text-zinc-50"
      >
        <RiUser3Line size={22} />
      </NavLink>

      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="flex flex-col items-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
      >
        {isDark ? <RiMoonClearLine size={22} /> : <RiSunLine size={22} />}
      </button>

      <button
        onClick={logoutHandler}
        className="flex flex-col items-center text-zinc-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
      >
        <RiLogoutCircleLine size={22} />
      </button>
    </nav>
  );
};

export default MobileNav;
