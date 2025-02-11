import express from 'express';
import compression from 'express-compression';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import config from './config/config.js';
import {connectMongo} from './config/mongo.js'
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import paymentRouter from './routes/payment.router.js';
import logger from './config/utils/logger.js';
import errorHandler from './middlewares/errorHandler.js';
import cors from 'cors';




const app = express();
const PORT = config.port;
const mongoDBURL = config.mongoDbUrl;

app.use(express.json());
app.use(cors({}));
// app.use(compression());
app.use(express.urlencoded({
    extended: true
}));
app.use(errorHandler);
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true, expires: new Date(Date.now() + 1000 * 60 * 60 * 24) }, // Expira en
        store: MongoStore.create({
        mongoUrl: mongoDBURL, // URL de conexión a MongoDB
        ttl: 60 * 60 * 24, // Tiempo de vida de la sesión en segundos (24 horas)
        autoRemove: 'interval', // Elimina sesiones expiradas
        autoRemoveInterval: 10 // Cada 10 minutos
    }) // Expira en 24hs
  }
));

// rutas
app.use("/payment", paymentRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
// ruta genérica
app.get("*", (req, res)=>{
    return res.status(404).json({
        status: 'error',
        message: 'Not Found'
    })
});

// puerto y notificacion
app.listen(PORT, ()=>{
    logger.info(`App listening on port ${PORT}`);
});

// conexión a la base de datos
connectMongo();

