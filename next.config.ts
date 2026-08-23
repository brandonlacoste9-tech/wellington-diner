import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      { source: '/:locale/services', destination: '/:locale/menu', permanent: false },
      { source: '/:locale/locations', destination: '/:locale/hours', permanent: false },
      { source: '/:locale/appointment', destination: '/:locale/contact', permanent: false },
      { source: '/:locale/loyalty', destination: '/:locale/specials', permanent: false },
      { source: '/:locale/warranty', destination: '/:locale/about', permanent: false },
    ];
  },
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
