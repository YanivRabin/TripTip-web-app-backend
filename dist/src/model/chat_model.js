"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const ChatSchema = new mongoose_1.default.Schema({
    room: { type: String, required: true },
    messages: [
        {
            sender: { type: String, required: true },
            message: { type: String, required: true },
        },
    ],
});
module.exports = mongoose_1.default.model("Chat", ChatSchema);
//# sourceMappingURL=chat_model.js.map