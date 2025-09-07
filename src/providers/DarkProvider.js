import { createContext, useContext, useState } from "react";
const DarkContext = createContext();

export const DarkProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <DarkContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkContext.Provider>
  );
};

export const useDark = () => useContext(DarkContext);
