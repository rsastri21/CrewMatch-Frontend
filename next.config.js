/** @type {import('next').NextConfig} */

  module.exports = {
    experimental: {
      appDir: true,
    },
    reactStrictMode: true,
    env: {
      API_URL: "https://crew-match.vercel.app"
    }
  };