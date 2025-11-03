import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import configPT from "./pt/config.json";
import changePasswordPT from "./pt/changePassword.json";

import configES from "./es/config.json";
import changePasswordES from "./es/changePassword.json";

i18n.use(initReactI18next).init({
  lng: "pt",
  fallbackLng: "pt",
  interpolation: { escapeValue: false },
  resources: {
    pt: {
      config: configPT,
      changePassword: changePasswordPT,
    },
    es: {
      config: configES,
      changePassword: changePasswordES,
    },
  },
});

export default i18n;
