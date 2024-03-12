import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import authRouter from "./routes/auth_route";
import postRouter from "./routes/post_route";
import chatController from "./controller/chat_controller";
import placesRouter from "./routes/places_api_route";
import multer from "multer";
import path from "path";
import cors from "cors";
import http from "http";
import { Server, Socket } from "socket.io";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
dotenv.config();

//chat
io.on("connection", (socket: Socket) => {
  socket.on("join-room", async (selectedUser: string, currentUser: string) => {
    const roomParticipants = [currentUser, selectedUser].sort();
    const roomId = `room_${roomParticipants[0]}_${roomParticipants[1]}`;
    socket.join(roomId);
    console.log(`Room created: ${roomId}`);
    io.to(roomId).emit("roomCreated", roomId); // Emit the event immediately after creating the room

    // Get all messages from the database
    const messages = await chatController.getMessages(roomId);
    io.to(roomId).emit("chat-history", messages); // Send chat history to the client as an array
  });

  socket.on(
    "send-message",
    (data: { to: string; from: string; msg: string }) => {
      chatController.addMessage(data.to, data.from, data.msg);
      // Broadcast message to everyone in the room
      io.to(data.to).emit("new-message", data);
    }
  );
});

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
      app.use("/api", placesRouter);
      app.get("/api/googleClientId", (req, res) => {
        const googleClientId = process.env.GOOGLE_CLIENT_ID;
        res.json({ clientId: googleClientId });
      });
      // Swagger
      if (process.env.NODE_ENV == "development") {
        const options = {
          definition: {
            openapi: "3.0.0",
            info: {
              title: "Trip Tip - Web dev 2024 REST API",
              version: "1.0.0",
              description: "REST server including authentication using JWT",
            },
            servers: [{ url: "http://localhost:3000" }],
          },
          apis: ["./src/routes/*.ts"],
        };
        const specs = swaggerJsDoc(options);
        app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
      }
      // start server
      resolve(server);
    });
  });
  return promise;
};

export = initApp;
