import { createContext, useContext, useState, useEffect } from "react";

const MetaContext = createContext();

export const useMeta = () => useContext(MetaContext);

export function MetaProvider({ children }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const siteName = "Knights Demplar Codex";

    document.title = title ? `${title} – ${siteName}` : siteName;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description || "Knights Demplar Codex";
  }, [title, description]);

  return (
    <MetaContext.Provider
      value={{ title, setTitle, description, setDescription }}
    >
      {children}
    </MetaContext.Provider>
  );
}
