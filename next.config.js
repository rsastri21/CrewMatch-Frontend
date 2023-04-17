/** @type {import('next').NextConfig} */
  const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

  module.exports = (phase, { defaultConfig }) => {
    if (phase === PHASE_DEVELOPMENT_SERVER) {
      return {
          experimental: {
            appDir: true,
          },
          reactStrictMode: true,
          env: {
            API_URL: "http://localhost:8080"
          }
      }
    }

    return {
      experimental: {
        appDir: true,
      },
      reactStrictMode: true,
      env: {
        API_URL: "https://crew-match.herokuapp.com"
      }
    }
    
  };