import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  output: 'standalone',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
