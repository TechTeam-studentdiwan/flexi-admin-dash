import { createContext, useContext, useState } from "react";
import Popup from "./Popup";

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const popMessage = (msg, duration = 3000) => {
    setMessage(msg);
    setVisible(true);

    setTimeout(() => {
      setVisible(false);
      setMessage("");
    }, duration);
  };

  return (
    <PopupContext.Provider value={{ popMessage }}>
      {children}
      {visible && <Popup message={message} onClose={() => setVisible(false)} />}
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);
