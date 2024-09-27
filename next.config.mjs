// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["cdn.intra.42.fr", "avatars.githubusercontent.com"],
  },
};

export default nextConfig; // Use export default instead of module.exports
