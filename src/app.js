import express from 'express';
import compression from 'express-compression';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import config from './config/config.js';
import {connectMongo} from './config/utils/mongo.js'
import productsRouter from './routes/products.router.js';
import logger from './config/utils/logger.js';
import errorHandler from './middlewares/errorHandler.js';


const app = express();
const PORT = config.port;
const mongoDBURL = config.mongoDbUrl;

app.use(express.json());
app.use(compression());
app.use(express.urlencoded({
    extended: true
}));
app.use(errorHandler);
app.use(session({
    store: MongoStore.create({ mongoUrl: mongoDBURL, ttl: 86400 }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/api/products", productsRouter);
app.listen(PORT, ()=>{
    logger.info(`App listening on port ${PORT}`);
});
connectMongo();

app.get("*", (req, res)=>{
    return res.status(404).json({
        status: 'error',
        message: 'Not Found'
    })
});