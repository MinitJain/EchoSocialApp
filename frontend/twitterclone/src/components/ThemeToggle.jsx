import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme) return storedTheme;

    // Follow system preference if no stored value
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="
        px-3 py-2
        rounded-lg
        border border-gray-300 dark:border-gray-600
        text-sm
        transition-all duration-200
        hover:scale-105
      "
    >
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
};

export default ThemeToggle;
