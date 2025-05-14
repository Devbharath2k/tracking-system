import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import logger from './Utils/logger.js';
import HandlerConnetion from './Config/db.js';
import router from './Router/route.js';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'],
    preflightContinue: false,
    credentials: true,
    allowedHeaders:['content-type', 'Authorization', 'x-auth-token', 'accept-authorization'] 

}));
app.use(helmet());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    logger.info("Server is running on port " + port);
    res.send("Welcome to the server");
})

app.use(router);

app.listen(port, ()=>{
    logger.info(`servering is runnig on this ${port}`);
    HandlerConnetion();
})