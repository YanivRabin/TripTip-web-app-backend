import express, { Express } from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import authRouter from './routes/auth_route';


const initApp = (): Promise<Express> => {
    const promise = new Promise<Express>((resolve) => {
        const db = mongoose.connection;
        db.on('error', error => console.error(error));
        db.once('open', () => console.log('connected to mongo'));
        mongoose.connect(process.env.DATABASE_URL).then(() => {
            app.use(bodyParser.urlencoded({ extended:true, limit:'1mb' }));
            app.use(bodyParser.json());
            app.use("/auth", authRouter);
            resolve(app);
        });
    });
    return promise;
}

export = initApp;