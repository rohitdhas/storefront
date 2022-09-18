/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "cdn.shopify.com",
      "content.jdmagicbox.com",
      "pngimg.com",
      "rukminim1.flixcart.com",
    ],
  },
};

module.exports = nextConfig;
