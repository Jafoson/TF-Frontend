"use client";

import { createContext, useContext, ReactNode, useState } from "react";

interface TitleContextProps {
  title: string;
  setTitle: (title: string) => void;
}

const TitleContext = createContext<TitleContextProps>({
  title: "",
  setTitle: () => {},
});

export const TitleProvider = ({ children }: { children: ReactNode }) => {
  const [title, setTitleState] = useState<string>("");

  const setTitle = (newTitle: string) => {
    setTitleState(newTitle);
  };

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
};

export const useTitle = () => useContext(TitleContext);
