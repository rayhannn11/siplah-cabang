import { Moon, Sun, Monitor } from "lucide-react";
import { useThemeStore } from "../stores";

export default function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-5 w-5 text-yellow-400" />;
      case "dark":
        return <Moon className="h-5 w-5 text-blue-400" />;
      default:
        return <Monitor className="h-5 w-5 text-gray-500 dark:text-gray-300" />;
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`btn btn-sm btn-ghost btn-circle h-9 w-9 p-0 flex items-center justify-center`}
      title={`Tema saat ini: ${theme}`}
    >
      {getIcon()}
      <span className="sr-only">Toggle Theme</span>
    </button>
  );
}
