import { createContext, useContext, useState } from "react";
const NotifContext = createContext();

export const NotifProvider = ({ children }) => {
  const [notif, setNotif] = useState(null);
  const notify = (msg) => {
    setNotif(msg);
    setTimeout(() => setNotif(""), 3000);
  };
  return (
    <NotifContext.Provider value={{ notif, setNotif, notify }}>
      {children}
    </NotifContext.Provider>
  );
};

export const useNotif = () => useContext(NotifContext);
