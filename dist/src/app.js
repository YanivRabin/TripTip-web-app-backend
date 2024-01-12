"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const GoogleStrategy = passport_google_oauth20_1.default.Strategy;
const auth_route_1 = __importDefault(require("./routes/auth_route"));
const post_route_1 = __importDefault(require("./routes/post_route"));
const initApp = () => {
    const promise = new Promise((resolve) => {
        const db = mongoose_1.default.connection;
        db.on('error', error => console.error(error));
        db.once('open', () => console.log('connected to mongo'));
        mongoose_1.default.connect(process.env.DATABASE_URL).then(() => {
            app.use(body_parser_1.default.urlencoded({ extended: true, limit: '1mb' }));
            app.use(body_parser_1.default.json());
            ``;
            app.use((0, express_session_1.default)({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
            app.use(passport_1.default.initialize());
            app.use(passport_1.default.session());
            passport_1.default.serializeUser((user, done) => { done(null, user); });
            passport_1.default.deserializeUser((user, done) => { done(null, user); });
            passport_1.default.use(new GoogleStrategy({
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL
            }, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
                console.log(profile);
                return done(null, profile);
            })));
            // for testing
            app.get('/', (req, res) => { res.send('<a href="http://localhost:3000/auth/googleLogin">Login with Google</a>'); });
            app.get('/pro', (req, res, next) => {
                req.user ? next() : res.sendStatus(401);
            }, (req, res) => { res.send('pro'); });
            //
            app.use("/auth", auth_route_1.default);
            app.use("/post", post_route_1.default);
            resolve(app);
        });
    });
    return promise;
};
module.exports = initApp;
//# sourceMappingURL=app.js.map