/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'uz',
    locales: ['uz', 'en', 'ru'],
    localeDetection: false,
  },
  saveMissing: true,
  defaultNS: 'common',
  load: 'currentOnly',
  saveMissingTo: 'all',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
