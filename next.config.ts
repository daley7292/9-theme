import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['https://test.redleaf.cloud'],
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);