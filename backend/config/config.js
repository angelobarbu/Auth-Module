import dotenv from 'dotenv';

dotenv.config();    // Load environment variables from .env file

const config = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    TOKEN_EXPIRATION_SECONDS: process.env.TOKEN_EXPIRATION_SECONDS,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
};
export default config;