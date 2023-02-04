/** @type {import('next').NextConfig} */

  module.exports = {
    experimental: {
      appDir: true,
    },
    reactStrictMode: false,
    env: {
      API_URL: "https://crew-match.herokuapp.com"
    }
  };