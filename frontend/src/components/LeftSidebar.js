import {
  RiHome5Line,
  RiUser3Line,
  RiBookmarkLine,
  RiLogoutBoxRLine,
  RiSunLine,
  RiMoonLine,
  RiRobot2Line,
} from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import { getMyProfile, getOtherUsers, setUser } from "../redux/userSlice";

const SidebarItem = ({ to, icon: Icon, label, onClick }) => {
  // Navigation link
  if (to) {
    return (
      <NavLink
        to={to}
        end
        className={({ isActive }) => `
          flex items-center gap-4 px-4 py-3 rounded-xl
          transition-all duration-200
          ${
            isActive
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }
        `}
      >
        <Icon size={20} />
        <span className="text-[15px] font-medium tracking-tight">{label}</span>
      </NavLink>
    );
  }

  // Button item (for AI)
  return (
    <button
      onClick={onClick}
      className="
        w-full flex items-center gap-4 px-4 py-3 rounded-xl
        text-zinc-600 dark:text-zinc-400
        hover:bg-zinc-100 dark:hover:bg-zinc-800
        transition-all duration-200
      "
    >
      <Icon size={20} />
      <span className="text-[15px] font-medium tracking-tight">{label}</span>
    </button>
  );
};

const LeftSidebar = ({ onAIClick }) => {
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDark, setIsDark] = useState(false);

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDark(!isDark);
  };

  const logoutHandler = async () => {
    try {
      localStorage.clear();
      dispatch(setUser(null));
      dispatch(getOtherUsers(null));
      dispatch(getMyProfile(null));

      await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });

      toast.success("Logged out");
      navigate("/login", { replace: true });
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <aside
      className="
        hidden md:flex
        w-[260px]
        flex-col
        min-h-screen
        bg-white dark:bg-zinc-950
        px-6 pt-8
      "
    >
      {/* Logo */}
      <div className="mb-14">
        <img
          src="/ZoomedLogo.png"
          alt="Logo"
          className="w-14 h-14 object-contain transition-transform duration-200 hover:scale-105"
        />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        <SidebarItem to="/" icon={RiHome5Line} label="Home" />

        {user && (
          <SidebarItem
            to={`/profile/${user._id}`}
            icon={RiUser3Line}
            label="Profile"
          />
        )}

        <SidebarItem to="/bookmarks" icon={RiBookmarkLine} label="Bookmarks" />

        {/* Echo AI */}
        <SidebarItem icon={RiRobot2Line} label="Echo AI" onClick={onAIClick} />

        {/* Theme Toggle */}
        <div
          className="
            flex items-center justify-between
            px-4 py-3 rounded-xl
            hover:bg-zinc-100 dark:hover:bg-zinc-800
            transition-all duration-200
          "
        >
          <div className="flex items-center gap-4">
            {isDark ? (
              <RiMoonLine size={20} className="text-zinc-500" />
            ) : (
              <RiSunLine size={20} className="text-zinc-500" />
            )}
            <span className="text-[15px] font-medium text-zinc-700 dark:text-zinc-300">
              Dark Mode
            </span>
          </div>

          <button
            onClick={toggleTheme}
            className={`
              relative w-11 h-6 rounded-full transition-all duration-300
              ${isDark ? "bg-zinc-700" : "bg-zinc-300"}
            `}
          >
            <span
              className={`
                absolute top-1 left-1 w-4 h-4 rounded-full bg-white
                transition-all duration-300
                ${isDark ? "translate-x-5" : "translate-x-0"}
              `}
            />
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={logoutHandler}
          className="
            flex items-center gap-4 px-4 py-3 rounded-xl
            text-red-500
            hover:bg-red-500/10
            transition-all duration-200
          "
        >
          <RiLogoutBoxRLine size={20} />
          <span className="text-[15px] font-medium tracking-tight">Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default LeftSidebar;
