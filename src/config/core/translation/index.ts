import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import {translationEN, translationVI} from '@/locales'

const resources = {
  en: { translation: translationEN },
  vi: { translation: translationVI }
};

i18next.use(initReactI18next).init({
  lng: 'vi', // if you're using a language detector, do not define the lng option
  debug: true,
  resources
})

export default i18next;