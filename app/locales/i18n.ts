import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import configPT from "./pt/config.json";

import configES from "./es/config.json";

i18n.use(initReactI18next).init({
  lng: "pt",
  fallbackLng: "pt",
  interpolation: { escapeValue: false },
  resources: {
    pt: {
      config: configPT,
    },
    es: {
      config: configES,
    },
  },
});

export default i18n;
