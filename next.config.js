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
      "m.media-amazon.com",
      "storefront-products.s3.amazonaws.com",
    ],
  },
  env: {
    CLIENT_URL: process.env.CLIENT_URL,
    BUCKET_URL: process.env.BUCKET_URL,
  },
};

module.exports = nextConfig;
