/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 确保样式能正确加载
  compiler: {
    styledComponents: true,
  },
  // 以下配置用于Docker部署
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: process.cwd(),
    instrumentationHook: true,
  },
};

module.exports = nextConfig; 