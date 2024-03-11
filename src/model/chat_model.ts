import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  room: { type: String, required: true },
  messages: [
    {
      sender: { type: String, required: true },
      message: { type: String, required: true },
    },
  ],
});

export = mongoose.model("Chat", ChatSchema);
