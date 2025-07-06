/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 确保样式能正确加载
  compiler: {
    styledComponents: true,
  },
  // Vercel 部署配置
  experimental: {
    instrumentationHook: true,
  },
  // 图片优化配置
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },
  // 输出配置 - 移除 standalone 以适配 Vercel
  // output: 'standalone', // 注释掉 Docker 相关配置
};

module.exports = nextConfig; 