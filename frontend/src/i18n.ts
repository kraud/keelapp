import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
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
        supportedLngs: ['en', 'es', 'de', 'ee'],
        nonExplicitSupportedLngs: true,
        // lng: (UILang!!) ? UILang :undefined, // Language to use (overrides language detection). If set to 'cimode' the output text will be the key
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        resources: {
            en: {
                translation: {
                    dashboard: {
                        title: 'Welcome, {{name}}',
                    },
                }
            },
            de: {
                translation: {
                    dashboard: {
                        title: 'Willkommen, {{name}}',
                    },
                }
            },
            ee: {
                translation: {
                    dashboard: {
                        title: 'Tere tulemast, {{name}}',
                    },
                }
            },
            es: {
                translation: {
                    dashboard: {
                        title: 'Bienvenido, {{name}}',
                    },
                }
            },
        }
    })

export default i18n;