/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compilerOptions: {
    baseUrl: ".",
    paths: {
      "/components/*": ["components/*"],
      "/pages/*": ["pages/*"],
      "/utils/*": ["utils/*"],
      "/styles/*": ["styles/*"],
      "/public/*": ["public/*"],
    },
  },
};

module.exports = nextConfig;
