/** @type {import('next').NextConfig} */
const nextConfig = {
  // 性能优化
  swcMinify: true,
  compress: true,
  
  // 安全优化
  poweredByHeader: false,
  
  // 图片优化
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 实验性功能
  experimental: {
    optimizeCss: true,
  },
  
  // 头部配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
