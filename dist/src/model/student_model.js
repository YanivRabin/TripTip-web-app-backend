"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const studentSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true }
});
module.exports = mongoose_1.default.model('Student', studentSchema);
//# sourceMappingURL=student_model.js.map