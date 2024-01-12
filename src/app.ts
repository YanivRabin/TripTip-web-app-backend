import express, { Express } from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import googleAuth from 'passport-google-oauth20';
const GoogleStrategy = googleAuth.Strategy;
import authRouter from './routes/auth_route';
import postRouter from './routes/post_route';


const initApp = (): Promise<Express> => {
    const promise = new Promise<Express>((resolve) => {
        const db = mongoose.connection;
        db.on('error', error => console.error(error));
        db.once('open', () => console.log('connected to mongo'));
        mongoose.connect(process.env.DATABASE_URL).then(() => {
            app.use(bodyParser.urlencoded({ extended:true, limit:'1mb' }));
            app.use(bodyParser.json());``
            app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
            app.use(passport.initialize());
            app.use(passport.session());
            passport.serializeUser((user, done) => {done(null, user);});
            passport.deserializeUser((user, done) => {done(null, user);});
            passport.use(new GoogleStrategy({
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL
            }, 
            async (accessToken, refreshToken, profile, done) => {
                // const user = await auth_controller.findOrCreateGoogleUser(profile.emails[0].value, profile.displayName);
                return done(null, profile);
            }));

            // for testing
            app.get('/', (req, res) => {res.send('<a href="http://localhost:3000/auth/googleLogin">Login with Google</a>');});
            app.get('/pro',
                (req, res, next) => {
                    req.user ? next() : res.sendStatus(401);
                },
                (req, res) => {res.send('pro');}
             );
            //

            app.use("/auth", authRouter);
            app.use("/post", postRouter);
            resolve(app);
        });
    });
    return promise;
}

export = initApp;