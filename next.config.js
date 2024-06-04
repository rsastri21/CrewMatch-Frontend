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
            API_URL: "http://localhost:8080",
            NEXT_PUBLIC_POSTHOG_KEY: "phc_lXKrOLIKzQ85vVsDLidPHuSbd5QSTwCXFM1qrLZqtew",
            NEXT_PUBLIC_POSTHOG_HOST: "https://us.i.posthog.com"
          }
      }
    }

    return {
      experimental: {
        appDir: true,
      },
      reactStrictMode: true,
      skipTrailingSlashRedirect: true,
      env: {
        API_URL: "https://crew-match.herokuapp.com",
        NEXT_PUBLIC_POSTHOG_KEY: "phc_lXKrOLIKzQ85vVsDLidPHuSbd5QSTwCXFM1qrLZqtew",
        NEXT_PUBLIC_POSTHOG_HOST: "https://us.i.posthog.com"
      }
    }
    
  };