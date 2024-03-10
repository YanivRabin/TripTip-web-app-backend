"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, require: true },
    description: { type: String },
    photo: { type: String },
    profilePic: { type: String, default: null },
    comments: [{
            user: { type: String, require: true },
            comment: { type: String, require: true }
        }]
});
module.exports = mongoose_1.default.model('Post', userSchema);
//# sourceMappingURL=post_model.js.map