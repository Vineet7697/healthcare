// import { createContext, useContext, useEffect, useState } from "react";
// import { lang } from "../context/language";

// const LanguageContext = createContext();

// export const LanguageProvider = ({ children }) => {
//   const [language, setLanguage] = useState("en");

//   useEffect(() => {
//     const saved = localStorage.getItem("lang");
//     if (saved) setLanguage(saved);
//   }, []);

//   const changeLanguage = (l) => {
//     setLanguage(l);
//     localStorage.setItem("lang", l);
//   };

//   return (
//     <LanguageContext.Provider value={{ language, changeLanguage, lang }}>
//       {children}
//     </LanguageContext.Provider>
//   );
// };

// export const useLanguage = () => useContext(LanguageContext);



import { createContext, useContext, useEffect, useState } from "react";
import { lang } from "../language";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved && lang[saved]) {
      setLanguage(saved);
    }
  }, []);

  const changeLanguage = (l) => {
    if (lang[l]) {
      setLanguage(l);
      localStorage.setItem("lang", l);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, lang, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
