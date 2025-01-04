import express from 'express';
import compression from 'express-compression';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import config from './config/config.js';


const app = express();
const PORT = config.port;
const mongoDBURL = config.mongoDbUrl;
console.log(config.mongoDbUrl, 'funciona?')
app.use(express.json());
app.use(compression());

app.use(session({
    store: MongoStore.create({ mongoUrl: mongoDBURL, ttl: 86400 }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);


const httpServer = app.listen(9090, ()=>{
    console.log(`App listening on port 9090`);
});

app.get("*", (req, res)=>{
    return res.status(404).json({
        status: 'error',
        message: 'Not Found'
    })
});