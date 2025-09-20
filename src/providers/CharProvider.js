import { createContext, useContext, useState, useEffect } from "react";
import { getCharacters } from "@/sanity/lib/queries";

const CharContext = createContext();

export const CharProvider = ({ children }) => {
  const [chars, setChars] = useState([]);
  const [sel, setSel] = useState(null);
  const [compChar, setCompChar] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const sanchar = await getCharacters();
        setChars(sanchar);
      } catch (error) {
        console.error("Failed to fetch characters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  return (
    <CharContext.Provider
      value={{ chars, setChars, sel, setSel, loading, compChar, setCompChar }}
    >
      {children}
    </CharContext.Provider>
  );
};

export const useChar = () => useContext(CharContext);
