const WebPageUrl = require('./lib/webPageUrl')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const dotEnvResult = require('dotenv').config();
if (dotEnvResult.error && process.env.NODE_ENV !== 'production') {
  console.warn('Cannot load configuration from .env. The .env file is probaly missing.');
}

const withPlugins = require('next-compose-plugins')
const withImages = require('next-images')

const nextConfig = {
  env: {
    API_APP_ID: process.env.REACT_APP_PARSE_APP_ID,
    API_REST_API_KEY: process.env.REACT_APP_PARSE_REST_API_KEY,
    API_SERVER_BASE_URL: process.env.REACT_APP_PARSE_SERVER_BASE_URL,
    API_JAVASCRIPT_KEY: process.env.REACT_APP_PARSE_JAVASCRIPT_KEY,
    API_GOOGLE_MAP_KEY: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    SIZE_GOOGLE_MAP: process.env.REACT_APP_GOOGLE_MAP_SIZE,
    DOMAIN_NAME: process.env.DOMAIN_NAME,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
    SESSION_EXPIRE_TIME: process.env.SESSION_EXPIRE_TIME,
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    STRIPE_BASE_URL: process.env.STRIPE_BASE_URL,
    NEXT_PUBLIC_STRAPI_API_URL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
    API_VERSION: process.env.API_VERSION,
    VERITRANS_API_KEY: process.env.VERITRANS_API_KEY,
    VERITRANS_API_URL: process.env.VERITRANS_API_URL,
    DOWNLOAD_APP_URL: process.env.DOWNLOAD_APP_URL || "https://nailiejp.page.link/open",
    GOOGLE_TAG_MANAGER_ID: process.env.GOOGLE_TAG_MANAGER_ID || "GTM-P843WJH",
    DEPLOY_ENV: process.env.DEPLOY_ENV,
    CACHE_S_MAX_AGE: process.env.CACHE_S_MAX_AGE || 60,
    CACHE_STALE_WHILE_REVALIDATE: process.env.CACHE_STALE_WHILE_REVALIDATE || 300
  },
  images: {
    domains: [
      'nailie-partner-test.s3.amazonaws.com',
      'd1qyhbwogwcazp.cloudfront.net',
      'salonboard-beta.s3.ap-northeast-1.amazonaws.com',
      'salonboard-prod.s3.ap-northeast-1.amazonaws.com',
      'nailie-dev.s3.amazonaws.com',
      'nailie-prod.s3.amazonaws.com',
      'd19m6mcdg8opxd.cloudfront.net',
      'd3e0lh5flsaz7m.cloudfront.net',
      'beta-nailie-api-default.s3.amazonaws.com',
      'production-nailie-api-default.s3.amazonaws.com',
      'development-nailie-api-default.s3.amazonaws.com',
      'd18mauf5k4osvd.cloudfront.net',
      'd3b937w34vn6qw.cloudfront.net'
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    scrollRestoration: true,
    modularizeImports: {
      '@material-ui/core': {
        transform: '@material-ui/core/{{member}}',
      },
      '@material-ui/lab': {
        transform: '@material-ui/lab/{{member}}',
      },
      lodash: {
        transform: 'lodash/{{member}}',
      },
    },
  },
  async rewrites() {
    return Object.keys(WebPageUrl).map(key => {
      if (typeof WebPageUrl[key] === 'string') {
        return { source: WebPageUrl[key], destination: '/downloads' }
      }
      return WebPageUrl[key]
    })
  }
}

module.exports = withPlugins([[withImages], [withBundleAnalyzer]], nextConfig)