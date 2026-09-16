import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
interface Themeprops {
  theme: boolean;
  toogleTheme: () => void;
}
interface Childrentype {
  children: ReactNode;
}

export const themeContext = createContext<Themeprops | undefined>(undefined);
export function ThemeProvide({ children }: Childrentype) {
  const [theme, setTheme] = useState(() => {
    const savedtime = localStorage.getItem("theme");
    return savedtime
      ? JSON.parse(savedtime)
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  function toogleTheme() {
    setTheme((prev: boolean) => !prev);
  }

  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem("theme", JSON.stringify(theme));
    root.classList.toggle("dark", theme);
  }, [theme]);

  return (
    <themeContext.Provider value={{ theme, toogleTheme }}>
      {children}
    </themeContext.Provider>
  );
}
