"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeMode = "dark" | "light";

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("recoin_theme") as ThemeMode;
    const initial = saved === "light" || saved === "dark" ? saved : "dark";
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  const applyTheme = (mode: ThemeMode) => {
    const root = document.documentElement;
    root.setAttribute("data-theme", mode);
    if (mode === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    localStorage.setItem("recoin_theme", mode);
    applyTheme(mode);
  };

  const toggleTheme = () => {
    const nextMode = theme === "dark" ? "light" : "dark";
    setTheme(nextMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);