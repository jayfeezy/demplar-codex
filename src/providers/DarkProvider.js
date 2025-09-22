import { createContext, useContext, useState, useEffect } from "react";

const DarkContext = createContext();

export const DarkProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;

    const saved = localStorage.getItem("darkMode");
    if (saved !== null) return saved === "true";

    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (localStorage.getItem("darkMode") === null) {
        setDarkMode(e.matches);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <DarkContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkContext.Provider>
  );
};

export const useDark = () => useContext(DarkContext);
