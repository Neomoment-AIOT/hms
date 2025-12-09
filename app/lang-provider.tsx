"use client";

import { createContext, useState, useEffect } from "react";

type LangContextType = {
  lang: "en" | "ar";
  setLang: (value: "en" | "ar") => void;
};

export const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
});

export default function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<"en" | "ar" | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedLang = sessionStorage.getItem("lang") as "en" | "ar" | null;

    setLangState(savedLang || "en");

    setLoaded(true);
  }, []);

  const setLang = (value: "en" | "ar") => {
    setLangState(value);
    sessionStorage.setItem("lang", value);
  };

  if (!loaded || lang === null) {
    return null;
  }

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}