/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite imagens externas (avatares, figurinhas)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
