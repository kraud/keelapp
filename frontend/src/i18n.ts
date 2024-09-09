import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
    // i18next-http-backend
    // loads translations from your server
    // https://github.com/i18next/i18next-http-backend
    .use(Backend) // stored in ../public/locales/[lang]/[namespace].json
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        // debug: true,
        fallbackLng: 'en',
        fallbackNS: 'common',
        supportedLngs: ['en', 'es', 'de', 'ee'],
        nonExplicitSupportedLngs: true,
        // lng: (UILang!!) ? UILang :undefined, // Language to use (overrides language detection). If set to 'cimode' the output text will be the key
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        }
    })

export default i18n