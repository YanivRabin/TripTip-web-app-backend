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
const path_1 = __importDefault(require("path"));
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_model_1.default.find();
        return res.status(200).send(posts);
    }
    catch (_a) {
        return res.status(400);
    }
});
const getPostsByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const user = await User.findById(req.params.id);
        const posts = yield post_model_1.default.find({ name: req.params.name });
        if (posts === null) {
            return res.status(401).send("there is no posts");
        }
        return res.status(200).send(posts);
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
        return res.status(200).send(post);
    }
    catch (_c) {
        return res.status(400);
    }
});
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const description = req.body.description;
    let photo;
    if (req.file) {
        const relativePath = path_1.default.relative('src/public/image', req.file.path);
        photo = relativePath.replace(/\\/g, '/'); // Convert backslashes to forward slashes for consistency
    }
    if (!description) {
        return res.status(400).send("description or photo is required");
    }
    try {
        const user = yield user_model_1.default.findOne({ name: name });
        if (user === null) {
            return res.status(401).send("user not found");
        }
        // save post and update user posts
        const post = new post_model_1.default({
            name: name,
            description: description,
            photo: photo,
            profilePic: user.photo
        });
        yield post.save();
        user.posts.push(post);
        yield user.save();
        return res.status(200).send(post);
    }
    catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).send({ error: "An error occurred while creating the post" });
    }
});
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const description = req.body.description;
    let photo;
    // Check if req.file exists and set photo accordingly
    if (req.file) {
        const relativePath = path_1.default.relative('src/public/image', req.file.path);
        photo = relativePath.replace(/\\/g, '/'); // Convert backslashes to forward slashes for consistency
    }
    if (!description && !photo) {
        return res.status(400).send("description or photo is required");
    }
    try {
        const updateFields = {};
        if (description) {
            updateFields.description = description;
        }
        if (photo) {
            updateFields.photo = photo;
        }
        const post = yield post_model_1.default.findOneAndUpdate({ _id: id }, updateFields, { new: true });
        if (post === null) {
            return res.status(401).send("post not found");
        }
        return res.status(200).send(post);
    }
    catch (_d) {
        return res.status(500);
    }
});
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    try {
        const deletePost = yield post_model_1.default.findByIdAndDelete(postId);
        if (!deletePost) {
            return res.status(401).send("post not found");
        }
        const user = yield user_model_1.default.findOne({ name: deletePost['name'] });
        if (user === null) {
            return res.status(401).send("user not found");
        }
        user.posts.pull(deletePost);
        yield user.save();
        return res.status(200).send("post deleted");
    }
    catch (_e) {
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
    catch (_f) {
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
    catch (_g) {
        return res.status(500);
    }
});
module.exports = {
    getAllPosts,
    getPostsByName,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    commentPost,
    getPostComments,
};
//# sourceMappingURL=post_controller.js.map