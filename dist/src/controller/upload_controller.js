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
const post_model_1 = __importDefault(require("../model/post_model"));
const user_model_1 = __importDefault(require("../model/user_model"));
const uploadUserPhoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findOneAndUpdate({ _id: req.params.id }, { photo: req.file.filename }, { new: true });
        if (user === null) {
            return res.status(401).send("user not found");
        }
        return res.status(200).send(user);
    }
    catch (_a) {
        return res.status(400);
    }
});
const uploadPostPhoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_model_1.default.findOneAndUpdate({ _id: req.params.postId }, { photo: req.file.filename }, { new: true });
        if (post === null) {
            return res.status(401).send("post not found");
        }
        return res.status(200).send(post);
    }
    catch (_b) {
        return res.status(400);
    }
});
module.exports = {
    uploadUserPhoto,
    uploadPostPhoto
};
//# sourceMappingURL=upload_controller.js.map