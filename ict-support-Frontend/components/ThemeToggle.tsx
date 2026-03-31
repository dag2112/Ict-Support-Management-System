"use client";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors
        bg-blue-800 hover:bg-blue-700 text-white
        dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-yellow-300"
    >
      {dark ? (
        <>
          <span className="text-base">☀️</span>
          <span className="hidden sm:inline text-xs">Light</span>
        </>
      ) : (
        <>
          <span className="text-base">🌙</span>
          <span className="hidden sm:inline text-xs">Dark</span>
        </>
      )}
    </button>
  );
}
