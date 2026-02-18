import { RiMoonClearLine, RiSunLine } from "react-icons/ri";
import useTheme from "../hooks/useTheme";

const ThemeToggle = ({ className = "" }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`flex items-center justify-center rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 ${className}`}
    >
      {isDark ? <RiMoonClearLine size={20} /> : <RiSunLine size={20} />}
    </button>
  );
};

export default ThemeToggle;
