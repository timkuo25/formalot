import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

i18n
   // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
   // learn more: https://github.com/i18next/i18next-http-backend
   .use(Backend)
   .use(initReactI18next) // passes i18n down to react-i18next
   .init({
      backend: {
         // 本地端用這個
         loadPath: "/locales/{{lng}}/{{ns}}.json",
         //loadPath: "/react-i18n-example/locales/{{lng}}/{{ns}}.json",
      },
      fallbackLng: "tw",
      lng: "tw",
      interpolation: {
         escapeValue: false, // not needed for react!!
      },
      react: { 
         useSuspense: false //   <---- this will do the magic
       }
   });

export default i18n;