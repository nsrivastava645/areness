import dotenv from 'dotenv';

dotenv.config();

export default {
    sendGridApiKey: process.env.SENDGRID_API_KEY,
    gmail: {
        email: process.env.EMAIL,
        password: process.env.EMAIL_PASS,
    },
};
