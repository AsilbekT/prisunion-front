import i18nConfig from './next-i18next.config.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: i18nConfig.i18n,
  env: {
    NEXT_PUBLIC_API_URL: 'http://v2-api.prisunion.uz',
  },
};

export default nextConfig;
