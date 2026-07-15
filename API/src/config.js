// Auto-generated config — reads from environment variables for Vercel deployment
// Copy this file as config.js and fill in values, OR set env vars in Vercel dashboard

const config = {
  // CORS: set to your frontend Vercel URL
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost',
    port: process.env.FRONTEND_PORT || 8080,
  },
  // Express port (not used in Vercel serverless, but kept for local dev)
  app: {
    port: process.env.PORT || 3000,
  },
  // PostgreSQL DB — use Supabase/Neon credentials in production
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'gbf',
    user: process.env.DB_USER || 'pguser',
    password: process.env.DB_PASSWORD || '',
    versionFile: process.env.DB_VERSION_FILE || './db.version',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'CHANGE_THIS_IN_PRODUCTION',
    BCRYPT_SALT_ROUNDS: 12,
    secureCookie: process.env.NODE_ENV === 'production', // HTTPS only in prod
  }
};

module.exports = config;
