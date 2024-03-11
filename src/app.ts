import express, { Express } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import authRouter from "./routes/auth_route";
import postRouter from "./routes/post_route";
import multer from "multer";
import path from "path";
import cors from "cors";

const app = express();
dotenv.config();

const initApp = (): Promise<Express> => {
  const promise = new Promise<Express>((resolve) => {
    const db = mongoose.connection;
    db.on("error", (error) => console.error(error));
    db.once("open", () => console.log("connected to mongo"));
    mongoose.connect(process.env.DATABASE_URL).then(() => {
      // express and react connection with cors
      app.use(cors());
      // body parser
      app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));
      app.use(bodyParser.json());
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