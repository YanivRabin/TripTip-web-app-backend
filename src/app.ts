import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import authRouter from "./routes/auth_route";
import postRouter from "./routes/post_route";
import messageRouter from "./routes/message_route";
import multer from "multer";
import path from "path";
import cors from "cors";
import http from "http";
import { Server, Socket } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, 
  {
    cors: { 
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
      }});
dotenv.config();

const initApp = (): Promise<http.Server> => {
  const promise = new Promise<http.Server>((resolve) => {
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
      app.use("/messages", messageRouter);
      app.get('/api/googleClientId', (req, res) => {
        const googleClientId = process.env.GOOGLE_CLIENT_ID;
        res.json({ clientId: googleClientId });
      });
      //chat
      io.on("connection", (socket: Socket) => {
        console.log("a user connected");
        socket.on("chat message", (msg) => {
          io.emit("chat message", msg);
        });
      });
      // start server
      resolve(server);
    });
  });
  return promise;
};

export = initApp;