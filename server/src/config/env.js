const path = require('path');
const dotenv = require('dotenv');

// Use the project root .env as the canonical configuration.
// Server .env is kept as a fallback for deployments that use one.
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const config = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexatech',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  JWT_SECRET: process.env.JWT_SECRET || 'nexatech_dev_jwt_secret_key_change_in_production_12345678',
  EMAIL_USER: process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : '',
  EMAIL_APP_PASSWORD: process.env.EMAIL_APP_PASSWORD ? process.env.EMAIL_APP_PASSWORD.replace(/\s+/g, '') : '',
  CONTACT_RECEIVER: process.env.CONTACT_RECEIVER ? process.env.CONTACT_RECEIVER.trim() : '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PROD: process.env.NODE_ENV === 'production',
};

module.exports = config;
