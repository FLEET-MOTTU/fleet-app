import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import configPT from "./pt/config.json";
import changePasswordPT from "./pt/changePassword.json";
import loginPT from "./pt/login.json";

import configES from "./es/config.json";
import changePasswordES from "./es/changePassword.json";
import loginES from "./es/login.json";

i18n.use(initReactI18next).init({
  lng: "pt",
  fallbackLng: "pt",
  interpolation: { escapeValue: false },
  resources: {
    pt: {
      config: configPT,
      changePassword: changePasswordPT,
      login: loginPT,
    },
    es: {
      config: configES,
      changePassword: changePasswordES,
      login: loginES,
    },
  },
});

export default i18n;
