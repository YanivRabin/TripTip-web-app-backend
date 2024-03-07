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
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const auth_route_1 = __importDefault(require("./routes/auth_route"));
const post_route_1 = __importDefault(require("./routes/post_route"));
const upload_route_1 = __importDefault(require("./routes/upload_route"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const auth_controller_1 = __importDefault(require("./controller/auth_controller"));
const user_model_1 = __importDefault(require("./model/user_model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const GoogleStrategy = passport_google_oauth20_1.default.Strategy;
dotenv_1.default.config();
const initApp = () => {
    const promise = new Promise((resolve) => {
        const db = mongoose_1.default.connection;
        db.on("error", (error) => console.error(error));
        db.once("open", () => console.log("connected to mongo"));
        mongoose_1.default.connect(process.env.DATABASE_URL).then(() => {
            app.use((0, cors_1.default)());
            // body parser
            app.use(body_parser_1.default.urlencoded({ extended: true, limit: "1mb" }));
            app.use(body_parser_1.default.json());
            ``;
            // passport and session
            app.use((0, express_session_1.default)({
                secret: process.env.SESSION_SECRET,
                resave: false,
                saveUninitialized: true,
            }));
            app.use(passport_1.default.initialize());
            app.use(passport_1.default.session());
            passport_1.default.serializeUser((user, done) => {
                done(null, user);
            });
            passport_1.default.deserializeUser((user, done) => {
                done(null, user);
            });
            passport_1.default.use(new GoogleStrategy({
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL,
            }, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
                const user = yield auth_controller_1.default.findOrCreateGoogleUser(profile.emails[0].value, profile.displayName);
                return done(null, user);
            })));
            // static files
            app.use(express_1.default.static("src/public"));
            // multer config
            const storage = multer_1.default.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, "src/public/images");
                },
                filename: (req, file, cb) => {
                    cb(null, file.fieldname + "-" + Date.now() + path_1.default.extname(file.originalname));
                },
            });
            const upload = (0, multer_1.default)({ storage: storage });
            // for testing google login
            app.get("/google", (req, res) => {
                res.send('<a href="http://localhost:3000/auth/googleLogin">Login with Google</a>');
            });
            app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
                const accessToken = req.user["accessToken"];
                const refreshToken = req.user["refreshToken"];
                if (accessToken && refreshToken) {
                    try {
                        const user = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET);
                        const userDb = yield user_model_1.default.findById(user["_id"]);
                        if (user === null) {
                            return res.sendStatus(404);
                        }
                        return res.status(200).send("logged in: " + userDb.name);
                    }
                    catch (err) {
                        return res.sendStatus(500);
                    }
                }
                else {
                    res.send("not logged in");
                }
            }));
            //
            // for testing upload
            app.get("/register", (req, res) => {
                res.send('<form action="http://localhost:3000/auth/register" method="post">email:<input type="text" name="email">password:<input type="text" name="password">name:<input type="text" name="name"><input type="submit"></form>');
            });
            app.get("/login", (req, res) => {
                res.send('<form action="http://localhost:3000/auth/login" method="post">email:<input type="text" name="email">password:<input type="text" name="password"><input type="submit"></form>');
            });
            app.get("/upload", (req, res) => {
                res.send('<form action="http://localhost:3000/uploads/userPhoto" method="post" enctype="multipart/form-data"><input type="file" name="file"><input type="submit"></form>');
            });
            //
            // paths
            app.use("/auth", auth_route_1.default);
            app.use("/posts", post_route_1.default);
            app.use("/uploads", upload.single("file"), upload_route_1.default);
            // start server
            resolve(app);
        });
    });
    return promise;
};
module.exports = initApp;
//# sourceMappingURL=app.js.map