import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Check if user previously set a preference
    const savedTheme = localStorage.getItem("theme");

    // Default to dark mode unless explicitly set to light
    if (savedTheme === "light") {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark-mode");
    } else {
      // Either no preference or dark mode preference
      setIsDarkMode(true);
      document.documentElement.classList.add("dark-mode");

      // Save the preference if not already saved
      if (!savedTheme) {
        localStorage.setItem("theme", "dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("theme", newMode ? "dark" : "light");

      if (newMode) {
        document.documentElement.classList.add("dark-mode");
      } else {
        document.documentElement.classList.remove("dark-mode");
      }

      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
