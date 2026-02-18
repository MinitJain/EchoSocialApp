import {
  RiHome5Line,
  RiUser3Line,
  RiBookmarkLine,
  RiLogoutBoxRLine,
  RiMoonClearLine,
  RiSunLine,
} from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import { getMyProfile, getOtherUsers, setUser } from "../redux/userSlice";
import useTheme from "../hooks/useTheme";

const SidebarItem = ({ to, icon: Icon, label, onClick }) => {
  if (to) {
    return (
      <NavLink
        to={to}
        end
        className={({ isActive }) => `
          flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm
          transition-colors duration-150 ease-out
          ${
            isActive
              ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
          }
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-0
        `}
      >
        <Icon size={20} />
        <span className="font-medium tracking-tight">{label}</span>
      </NavLink>
    );
  }

  // Button item
  return (
    <button
      onClick={onClick}
      className="
        flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm
        text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900
        transition-colors duration-150 ease-out
        dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-0
      "
    >
      <Icon size={20} />
      <span className="text-[15px] font-medium tracking-tight">{label}</span>
    </button>
  );
};

const LeftSidebar = () => {
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark, toggleTheme } = useTheme();

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
    <aside className="hidden md:flex w-64 flex-col h-screen border-r border-zinc-200 dark:border-zinc-800">
      {/* Scrollable content */}
      <div className="flex flex-col h-full overflow-y-auto px-4 pt-6">
        {/* Logo */}
        <div className="mb-10">
          <img
            src="/ZoomedLogo.png"
            alt="Logo"
            className="h-16 w-16 object-contain hover:scale-105 transition"
          />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5">
          <SidebarItem to="/" icon={RiHome5Line} label="Home" />
          {user && (
            <SidebarItem
              to={`/profile/${user._id}`}
              icon={RiUser3Line}
              label="Profile"
            />
          )}
          <SidebarItem
            to="/bookmarks"
            icon={RiBookmarkLine}
            label="Bookmarks"
          />
        </nav>

        {/* Push logout to bottom */}
        <div className="mt-auto pb-6 pt-6 flex flex-col gap-2">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 transition-colors duration-150"
            aria-label="Toggle theme"
          >
            {isDark ? <RiMoonClearLine size={20} /> : <RiSunLine size={20} />}
            <span className="font-medium tracking-tight">Theme</span>
          </button>
          <button
            onClick={logoutHandler}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition"
          >
            <RiLogoutBoxRLine size={20} />
            <span className="text-[15px] font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
