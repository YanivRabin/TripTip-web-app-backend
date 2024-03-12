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
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../model/user_model"));
const chat_model_1 = __importDefault(require("../model/chat_model"));
const chat_controller_1 = __importDefault(require("../controller/chat_controller"));
let app;
const user1 = {
    email: "yaniv@rabin.com",
    password: "yanivrabin",
    name: "yaniv",
    accessToken: "",
};
const user2 = {
    email: "joni@malki.com",
    password: "jonimalki",
    name: "joni",
    accessToken: "",
};
const user3 = {
    email: "tal@tal.com",
    password: "talavrham",
    name: "tal",
    accessToken: "",
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("brforeAll");
    app = yield (0, app_1.default)();
    yield user_model_1.default.deleteMany();
    yield chat_model_1.default.deleteMany();
    // create user1 and get access token
    const res1 = yield (0, supertest_1.default)(app).post("/auth/register").send(user1);
    user1.accessToken = res1.body.accessToken;
    // create user2 and get access token
    const res2 = yield (0, supertest_1.default)(app).post("/auth/register").send(user2);
    user2.accessToken = res2.body.accessToken;
    // create user3 and get access token
    const res3 = yield (0, supertest_1.default)(app).post("/auth/register").send(user3);
    user3.accessToken = res3.body.accessToken;
}));
afterAll((done) => {
    mongoose_1.default.connection.close();
    done();
});
describe("-- Chat tests --", () => {
    test("test chat - send message from user1 to user 2", () => __awaiter(void 0, void 0, void 0, function* () {
        const roomParticipants = [user1.name, user2.name].sort();
        const roomId = `room_${roomParticipants[0]}_${roomParticipants[1]}`;
        yield chat_controller_1.default.addMessage(roomId, user1.name, "message1");
        const messages = yield chat_controller_1.default.getMessages(roomId);
        expect(messages.length).toBe(1);
        expect(messages[0].message).toBe("message1");
    }));
    test("test chat - send message from user2 to user 1", () => __awaiter(void 0, void 0, void 0, function* () {
        const roomParticipants = [user1.name, user2.name].sort();
        const roomId = `room_${roomParticipants[0]}_${roomParticipants[1]}`;
        yield chat_controller_1.default.addMessage(roomId, user2.name, "message2");
        const messages = yield chat_controller_1.default.getMessages(roomId);
        expect(messages.length).toBe(2);
        expect(messages[1].message).toBe("message2");
    }));
    test("test chat - get chat between user1 and user3", () => __awaiter(void 0, void 0, void 0, function* () {
        const roomParticipants = [user1.name, user3.name].sort();
        const roomId = `room_${roomParticipants[0]}_${roomParticipants[1]}`;
        const messages = yield chat_controller_1.default.getMessages(roomId);
        expect(messages.length).toBe(0);
    }));
    test("test chat - send message from user1 to user 3", () => __awaiter(void 0, void 0, void 0, function* () {
        const roomParticipants = [user1.name, user3.name].sort();
        const roomId = `room_${roomParticipants[0]}_${roomParticipants[1]}`;
        yield chat_controller_1.default.addMessage(roomId, user1.name, "message3");
        const messages = yield chat_controller_1.default.getMessages(roomId);
        expect(messages.length).toBe(1);
        expect(messages[0].message).toBe("message3");
    }));
});
//# sourceMappingURL=chat.test.js.map