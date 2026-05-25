/** @type {import('next').NextConfig} */
const nextConfig = {
  // Domínio de imagens externas usadas nos cards de serviço
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
  },

  // Variáveis de ambiente públicas validadas em build time
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
}

module.exports = nextConfig
