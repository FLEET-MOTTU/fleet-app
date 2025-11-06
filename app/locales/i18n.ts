import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import configPT from "./pt/config.json";
import changePasswordPT from "./pt/changePassword.json";
import loginPT from "./pt/login.json";
import homeAdmPT from "./pt/homeAdm.json";
import pateoPT from "./pt/pateo.json";
import zonasPT from "./pt/zonas.json";

import configES from "./es/config.json";
import changePasswordES from "./es/changePassword.json";
import loginES from "./es/login.json";
import homeAdmES from "./es/homeAdm.json";
import pateoES from "./es/pateo.json";
import zonasES from "./es/zonas.json";

i18n.use(initReactI18next).init({
  lng: "pt",
  fallbackLng: "pt",
  interpolation: { escapeValue: false },
  resources: {
    pt: {
      config: configPT,
      changePassword: changePasswordPT,
      login: loginPT,
      homeAdm: homeAdmPT,
      pateo: pateoPT,
      zonas: zonasPT,
    },
    es: {
      config: configES,
      changePassword: changePasswordES,
      login: loginES,
      homeAdm: homeAdmES,
      pateo: pateoES,
      zonas: zonasES,
    },
  },
});

export default i18n;
