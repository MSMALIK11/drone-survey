import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import enJSON from './locales/en/translation.json'
i18n.use(initReactI18next).init({
  resources: {
    en:{translation:enJSON},
  },
  lng: "en",
  fallbackLng:'en',
  interpolation:{escapeValue:false}
});