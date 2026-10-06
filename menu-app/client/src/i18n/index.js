import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import azCommon from './locales/az/common.json'
import azPublic from './locales/az/public.json'
import azAdmin from './locales/az/admin.json'
import enCommon from './locales/en/common.json'
import enPublic from './locales/en/public.json'
import enAdmin from './locales/en/admin.json'
import ruCommon from './locales/ru/common.json'
import ruPublic from './locales/ru/public.json'
import ruAdmin from './locales/ru/admin.json'

export const LANGUAGES = ['az', 'en', 'ru']
export const DEFAULT_LANGUAGE = 'az'
export const LANG_STORAGE_KEY = 'menu_lang'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      az: { common: azCommon, public: azPublic, admin: azAdmin },
      en: { common: enCommon, public: enPublic, admin: enAdmin },
      ru: { common: ruCommon, public: ruPublic, admin: ruAdmin },
    },
    supportedLngs: LANGUAGES,
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    fallbackLng: DEFAULT_LANGUAGE,
    ns: ['common', 'public', 'admin'],
    defaultNS: 'common',
    fallbackNS: 'common',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LANG_STORAGE_KEY,
      caches: ['localStorage'],
    },
    returnNull: false,
  })

const setHtmlLang = (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = (lng || DEFAULT_LANGUAGE).slice(0, 2)
  }
}
setHtmlLang(i18n.resolvedLanguage)
i18n.on('languageChanged', setHtmlLang)

/** Hazırkı dil (az | en | ru). */
export function currentLang() {
  const lng = (i18n.resolvedLanguage || i18n.language || DEFAULT_LANGUAGE).slice(0, 2)
  return LANGUAGES.includes(lng) ? lng : DEFAULT_LANGUAGE
}

export default i18n
