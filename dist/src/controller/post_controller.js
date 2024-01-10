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
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_model_1.default.find();
        return res.status(200).send(posts);
    }
    catch (_a) {
        return res.status(400);
    }
});
const getPostsByOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(req.params.id);
        if (user === null) {
            return res.status(401).send("user not found");
        }
        return res.status(200).send(user.posts);
    }
    catch (_b) {
        return res.status(400);
    }
});
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_model_1.default.findById(req.params.postId);
        if (post === null) {
            return res.status(401).send("post not found");
        }
        console.log(post);
        return res.status(200).send(post);
    }
    catch (_c) {
        return res.status(400);
    }
});
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = req.body.owner;
    const description = req.body.description;
    const photo = req.body.photo;
    if (!description && !photo) {
        return res.status(400).send("description or photo is required");
    }
    try {
        const user = yield user_model_1.default.findOne({ _id: owner });
        if (user === null) {
            return res.status(401).send("user not found");
        }
        // save post and update user posts
        const post = new post_model_1.default(req.body);
        yield post.save();
        user.posts.push(post);
        yield user.save();
        return res.status(200).send(post);
    }
    catch (_d) {
        console.log("error");
        return res.status(500);
    }
});
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const description = req.body.description;
    const photo = req.body.photo;
    if (!description && !photo) {
        return res.status(400).send("description or photo is required");
    }
    try {
        const post = yield post_model_1.default.findOneAndUpdate({ _id: id }, req.body, { new: true });
        if (post === null) {
            return res.status(401).send("post not found");
        }
        return res.status(200).send(post);
    }
    catch (_e) {
        return res.status(500);
    }
});
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const deletePost = yield post_model_1.default.findByIdAndDelete(id);
        if (!deletePost) {
            return res.status(401).send("post not found");
        }
        const user = yield user_model_1.default.findOne({ _id: deletePost['owner'] });
        if (user === null) {
            return res.status(401).send("user not found");
        }
        user.posts.pull(deletePost);
        yield user.save();
        return res.status(200).send("post deleted");
    }
    catch (_f) {
        return res.status(500);
    }
});
const commentPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    const user = req.body.user;
    const comment = req.body.comment;
    if (!user || !comment) {
        return res.status(400).send("user and comment are required");
    }
    try {
        const post = yield post_model_1.default.findById(postId);
        if (post === null) {
            return res.status(401).send("post not found");
        }
        post.comments.push(req.body);
        yield post.save();
        return res.status(200).send(post);
    }
    catch (_g) {
        return res.status(500);
    }
});
const getPostComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    try {
        const post = yield post_model_1.default.findById(postId);
        if (post === null) {
            return res.status(401).send("post not found");
        }
        return res.status(200).send(post.comments);
    }
    catch (_h) {
        return res.status(500);
    }
});
module.exports = {
    getAllPosts,
    getPostsByOwner,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    commentPost,
    getPostComments,
};
//# sourceMappingURL=post_controller.js.map