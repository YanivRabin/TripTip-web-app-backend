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
const auth_route_1 = __importDefault(require("./routes/auth_route"));
const post_route_1 = __importDefault(require("./routes/post_route"));
const chat_controller_1 = __importDefault(require("./controller/chat_controller"));
const places_api_route_1 = __importDefault(require("./routes/places_api_route"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const socket_io_1 = require("socket.io");
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
let server;
const app = (0, express_1.default)();
if (process.env.NODE_ENV !== "production") {
    console.log("Development mode");
    server = http_1.default.createServer(app);
}
else {
    console.log("Production mode");
    const credentials = {
        key: fs_1.default.readFileSync("../client-key.pem"),
        cert: fs_1.default.readFileSync("../client-cert.pem"),
    };
    server = https_1.default.createServer(credentials, app);
}
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "https://localhost:3000",
        methods: ["GET", "POST"],
    },
});
dotenv_1.default.config();
//chat
io.on("connection", (socket) => {
    socket.on("join-room", (selectedUser, currentUser) => __awaiter(void 0, void 0, void 0, function* () {
        const roomParticipants = [currentUser, selectedUser].sort();
        const roomId = `room_${roomParticipants[0]}_${roomParticipants[1]}`;
        socket.join(roomId);
        console.log(`Room created: ${roomId}`);
        io.to(roomId).emit("roomCreated", roomId); // Emit the event immediately after creating the room
        // Get all messages from the database
        const messages = yield chat_controller_1.default.getMessages(roomId);
        io.to(roomId).emit("chat-history", messages); // Send chat history to the client as an array
    }));
    socket.on("send-message", (data) => {
        chat_controller_1.default.addMessage(data.to, data.from, data.msg);
        // Broadcast message to everyone in the room
        io.to(data.to).emit("new-message", data);
    });
});
const initApp = () => {
    const promise = new Promise((resolve) => {
        const db = mongoose_1.default.connection;
        db.on("error", (error) => console.error(error));
        db.once("open", () => console.log("connected to mongo"));
        mongoose_1.default.connect(process.env.DATABASE_URL).then(() => {
            // express and react connection with cors
            app.use((0, cors_1.default)());
            // body parser
            app.use(body_parser_1.default.urlencoded({ extended: true, limit: "1mb" }));
            app.use(body_parser_1.default.json());
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
            // paths
            app.use("/auth", upload.single("file"), auth_route_1.default);
            app.use("/posts", upload.single("file"), post_route_1.default);
            app.use("/api", places_api_route_1.default);
            app.get("/api/googleClientId", (req, res) => {
                const googleClientId = process.env.GOOGLE_CLIENT_ID;
                res.json({ clientId: googleClientId });
            });
            // Swagger
            const options = {
                definition: {
                    openapi: "3.0.0",
                    info: {
                        title: "Trip Tip - Web dev 2024 REST API",
                        version: "1.0.0",
                        description: "REST server including authentication using JWT",
                    },
                    servers: [{ url: "http://localhost" }],
                },
                apis: ["./src/routes/*.ts"],
            };
            const specs = (0, swagger_jsdoc_1.default)(options);
            app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
            app.use("/assets", express_1.default.static('src/public/client/assets'));
            app.use("*", (req, res) => {
                res.sendFile('index.html', { root: 'src/public/client' });
            });
            // start server
            resolve(server);
        });
    });
    return promise;
};
module.exports = initApp;
//# sourceMappingURL=app.js.map