// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: [
//       'via.placeholder.com',
//       'static.toiimg.com'  // Added Times of India domain
//     ],
//   },
// }

// module.exports = nextConfig 
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'static.toiimg.com',
      },
    ],
  },
};

module.exports = nextConfig;
