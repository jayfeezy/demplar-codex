import { createContext, useContext, useState } from "react";
import { characters } from "@/lib/characters";
const CharContext = createContext();

export const CharProvider = ({ children }) => {
  const [chars, setChars] = useState(characters);
  const [sel, setSel] = useState(null);

  return (
    <CharContext.Provider value={{ chars, setChars, sel, setSel }}>
      {children}
    </CharContext.Provider>
  );
};

export const useChar = () => useContext(CharContext);
