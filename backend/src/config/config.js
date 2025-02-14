import dotenv from 'dotenv';
// import { Command } from 'commander';

// const program = new Command();

// program.option('--mode <mode>', 'PRODUCTION', 'DEVELOPMENT');
// program.parse();


dotenv.config(/*{
    path: program.opts().mode === 'DEVELOPMENT' ? '../../.env.development' : '../../.env.production'
}*/);


export default {
    mode: process.env.MODE,
    port: process.env.PORT,
    mongoDbUrl: process.env.MONGO_URL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    persistence: process.env.PERSISTENCE,
    apiUrl: process.env.API_URL,
    googleEmail: process.env.GOOGLE_EMAIL,
    googlePass: process.env.GOOGLE_PASSWORD,
    googleID: process.env.GOOGLE_CLIENT_ID,
    googleSecret: process.env.GOOGLE_CLIENT_SECRET,
    tokenJWTSecret: process.env.JWT_SECRET,
    sessionSecret: process.env.SESSION_SECRET,
    mercadoPagoToken: process.env.MERCADO_PAGO_TOKEN,
    httpTohttps: process.env.HTTP_TO_HTTPS,
    frontendUrl: process.env.FRONTEND_URL
}