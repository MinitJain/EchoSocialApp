import {
  RiHome5Line,
  RiUser3Line,
  RiBookmarkLine,
  RiRobotLine,
} from "react-icons/ri";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

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

const LeftSidebar = ({ isAIChatOpen, setIsAIChatOpen }) => {
  const { user } = useSelector((store) => store.user);

  const toggleAIChat = () => {
    setIsAIChatOpen(!isAIChatOpen);
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

        {/* Push to bottom */}
        <div className="mt-auto pb-6 pt-6 flex flex-col gap-2">
          <button
            onClick={toggleAIChat}
            className={`
              flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm
              transition-colors duration-150 ease-out
              ${
                isAIChatOpen
                  ? "bg-indigo-500 text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              }
            `}
            aria-label="Toggle Echo AI"
          >
            <RiRobotLine size={20} />
            <span className="font-medium tracking-tight">Echo AI</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
