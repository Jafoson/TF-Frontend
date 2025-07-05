import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  basePath: '/api/v1/namespaces/tournamentfox/services/http:tournamentfox-frontend:80/proxy',
  assetPrefix: '/api/v1/namespaces/tournamentfox/services/http:tournamentfox-frontend:80/proxy',
  trailingSlash: true,
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
