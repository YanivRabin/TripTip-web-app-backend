import express, { Express } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import passport from "passport";
import session from "express-session";
import googleAuth from "passport-google-oauth20";
import authRouter from "./routes/auth_route";
import postRouter from "./routes/post_route";
import multer from "multer";
import path from "path";
import auth_controller from "./controller/auth_controller";
import User from "./model/user_model";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
const GoogleStrategy = googleAuth.Strategy;
dotenv.config();

const initApp = (): Promise<Express> => {
  const promise = new Promise<Express>((resolve) => {
    const db = mongoose.connection;
    db.on("error", (error) => console.error(error));
    db.once("open", () => console.log("connected to mongo"));
    mongoose.connect(process.env.DATABASE_URL).then(() => {

        app.use(cors());

      // body parser
      app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));
      app.use(bodyParser.json());
      ``;
      // passport and session
      app.use(
        session({
          secret: process.env.SESSION_SECRET,
          resave: false,
          saveUninitialized: true,
        })
      );
      app.use(passport.initialize());
      app.use(passport.session());
      passport.serializeUser((user, done) => {
        done(null, user);
      });
      passport.deserializeUser((user, done) => {
        done(null, user);
      });
      passport.use(
        new GoogleStrategy(
          {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
          },
          async (accessToken, refreshToken, profile, done) => {
            const user = await auth_controller.findOrCreateGoogleUser(
              profile.emails[0].value,
              profile.displayName
            );
            return done(null, user);
          }
        )
      );
      // static files
      app.use(express.static("src/public"));
      // multer config
      const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, "src/public/images");
        },
        filename: (req, file, cb) => {
          cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
          );
        },
      });
      const upload = multer({ storage: storage });

      // for testing google login
      // app.get("/google", (req, res) => {
      //   res.send(
      //     '<a href="http://localhost:3000/auth/googleLogin">Login with Google</a>'
      //   );
      // });
      // app.get("/", async (req, res) => {
      //   const accessToken = req.user["accessToken"];
      //   const refreshToken = req.user["refreshToken"];
      //   if (accessToken && refreshToken) {
      //     try {
      //       const user = jwt.verify(accessToken, process.env.JWT_SECRET);
      //       const userDb = await User.findById(user["_id"]);
      //       if (user === null) {
      //         return res.sendStatus(404);
      //       }
      //       return res.status(200).send("logged in: " + userDb.name);
      //     } catch (err) {
      //       return res.sendStatus(500);
      //     }
      //   } else {
      //     res.send("not logged in");
      //   }
      // });
    
      // paths
      app.use("/auth", upload.single("file"), authRouter);
      app.use("/posts", upload.single("file"), postRouter);
      // start server
      resolve(app);
    });
  });
  return promise;
};

export = initApp;
