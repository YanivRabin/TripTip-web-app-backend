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
const chat_model_1 = __importDefault(require("../model/chat_model"));
const getMessages = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chat = yield chat_model_1.default.findOne({ room: roomId });
        if (chat) {
            return chat.messages;
        }
        else {
            return [];
        }
    }
    catch (error) {
        console.log(error);
    }
});
const addMessage = (roomId, sender, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chat = yield chat_model_1.default.findOne({ room: roomId });
        if (chat) {
            chat.messages.push({ sender, message });
            yield chat.save();
            return true;
        }
        else {
            const newChat = new chat_model_1.default({ room: roomId, messages: [{ sender, message }] });
            yield newChat.save();
            return true;
        }
    }
    catch (error) {
        console.log(error);
        return false;
    }
});
module.exports = {
    getMessages,
    addMessage
};
//# sourceMappingURL=chat_controller.js.map