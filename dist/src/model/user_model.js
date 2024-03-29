"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    photo: { type: String, default: null },
    posts: [{
            post: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Post' }
        }],
    tokens: { type: [String] }
});
module.exports = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=user_model.js.map