import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import User from "../model/user_model";
import Chat from "../model/chat_model";
import chatController from "../controller/chat_controller";
import http from "http";

let app: http.Server;
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

beforeAll(async () => {
  console.log("brforeAll");
  app = await initApp();
  await User.deleteMany();
  await Chat.deleteMany();
  // create user1 and get access token
  const res1 = await request(app).post("/auth/register").send(user1);
  user1.accessToken = res1.body.accessToken;
  // create user2 and get access token
  const res2 = await request(app).post("/auth/register").send(user2);
  user2.accessToken = res2.body.accessToken;
  // create user3 and get access token
  const res3 = await request(app).post("/auth/register").send(user3);
  user3.accessToken = res3.body.accessToken;
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe("-- Chat tests --", () => {
  test("test chat - send message from user1 to user 2", async () => {
    const roomParticipants = [user1.name, user2.name].sort();
    const roomId = `room_${roomParticipants[0]}_${roomParticipants[1]}`;
    await chatController.addMessage(roomId, user1.name, "message1");
    const messages = await chatController.getMessages(roomId);
    expect(messages.length).toBe(1);
    expect(messages[0].message).toBe("message1");
  });

  test("test chat - send message from user2 to user 1", async () => {
    const roomParticipants = [user1.name, user2.name].sort();
    const roomId = `room_${roomParticipants[0]}_${roomParticipants[1]}`;
    await chatController.addMessage(roomId, user2.name, "message2");
    const messages = await chatController.getMessages(roomId);
    expect(messages.length).toBe(2);
    expect(messages[1].message).toBe("message2");
  });

  test("test chat - get chat between user1 and user3", async () => {
    const roomParticipants = [user1.name, user3.name].sort();
    const roomId = `room_${roomParticipants[0]}_${roomParticipants[1]}`;
    const messages = await chatController.getMessages(roomId);
    expect(messages.length).toBe(0);
  });

    test("test chat - send message from user1 to user 3", async () => {
        const roomParticipants = [user1.name, user3.name].sort();
        const roomId = `room_${roomParticipants[0]}_${roomParticipants[1]}`;
        await chatController.addMessage(roomId, user1.name, "message3");
        const messages = await chatController.getMessages(roomId);
        expect(messages.length).toBe(1);
        expect(messages[0].message).toBe("message3");
    });
});
