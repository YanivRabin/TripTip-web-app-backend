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
const user_model_1 = __importDefault(require("../model/user_model"));
const post_model_1 = __importDefault(require("../model/post_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    if (!email || !password || !name) {
        return res.status(400).send("missing email, password or name");
    }
    try {
        // check if user exist
        const existUser = yield user_model_1.default.findOne({ email: email });
        const existUser2 = yield user_model_1.default.findOne({ name: name });
        if (existUser2 != null) {
            return res.status(406).send("Name already exists - choose a different name");
        }
        if (existUser != null) {
            return res.status(406).send("Email already exists");
        }
        // encrypt password and save user
        const salt = yield bcrypt_1.default.genSalt(10);
        const encryptedPassword = yield bcrypt_1.default.hash(password, salt);
        const user = yield user_model_1.default.create({
            'email': email,
            'password': encryptedPassword,
            'name': name
        });
        // create tokens
        const accessToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
        const refreshToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET);
        // save refresh token in db
        user.tokens = [];
        user.tokens.push(refreshToken);
        yield user.save();
        // send tokens to client
        return res.status(201).send({ 'user': user, 'accessToken': accessToken, 'refreshToken': refreshToken });
    }
    catch (err) {
        console.log("error: " + err.message);
        return res.status(500);
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).send("missing email or password");
    }
    try {
        // check if user exist
        const user = yield user_model_1.default.findOne({ 'email': email });
        if (user == null) {
            return res.status(401).send("email or password incorrect");
        }
        // check password is correct
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match) {
            return res.status(401).send("email or password incorrect");
        }
        // create tokens
        const accessToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
        const refreshToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET);
        // save refresh token in db
        user.tokens = [];
        user.tokens.push(refreshToken);
        yield user.save();
        // send tokens to client
        return res.status(200).send({ 'user': user, 'accessToken': accessToken, 'refreshToken': refreshToken });
    }
    catch (err) {
        return res.status(500);
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // check if token exist
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (!token) {
        return res.sendStatus(401);
    }
    // check if token is valid
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // check if user exist
            const userDb = yield user_model_1.default.findById(user._id);
            if (userDb === null) {
                return res.sendStatus(403);
            }
            // remove token from db
            if (!userDb.tokens || !userDb.tokens.includes(token)) {
                userDb.tokens = [];
            }
            else {
                userDb.tokens = userDb.tokens.filter(t => t !== token);
            }
            yield userDb.save();
            console.log("userDb: ", userDb);
            return res.status(200).send(userDb);
        }
        catch (err) {
            return res.sendStatus(500);
        }
    }));
});
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // check if token exist
    const authHeaders = req.headers.authorization;
    const token = authHeaders && authHeaders.split(' ')[1];
    if (token === null) {
        return res.sendStatus(401);
    }
    // check if token is valid
    jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(403).send(err.message);
        }
        try {
            // check if user exist
            const userDb = yield user_model_1.default.findById(user._id);
            if (userDb === null) {
                return res.status(403).send('invalid requset');
            }
            // check if token is valid
            if (userDb.tokens.includes(token) === null) {
                userDb.tokens = []; //invalidate all user tokens
                yield userDb.save();
                return res.status(403).send('invalid requset');
            }
            // create new tokens and save in db
            const accessToken = jsonwebtoken_1.default.sign({ _id: userDb._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
            const refreshToken = jsonwebtoken_1.default.sign({ _id: userDb._id }, process.env.JWT_REFRESH_SECRET);
            userDb.tokens[userDb.tokens.indexOf(token)] = refreshToken;
            yield userDb.save();
            // send tokens to client
            return res.status(200).send({ 'accessToken': accessToken, 'refreshToken': refreshToken });
        }
        catch (err) {
            return res.status(500);
        }
    }));
});
const userInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(req.user['_id']);
        if (user === null) {
            return res.sendStatus(404);
        }
        return res.status(200).send(user);
    }
    catch (err) {
        return res.sendStatus(500);
    }
});
const findOrCreateGoogleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const name = req.body.name;
    try {
        // Check if the user already exists in your database using email
        let user = yield user_model_1.default.findOne({ email: email });
        if (!user) {
            // If the user doesn't exist, create a new user in the database
            const randomPassword = Math.random().toString(36).substring(7);
            const salt = yield bcrypt_1.default.genSalt(10);
            const encryptedPassword = yield bcrypt_1.default.hash(randomPassword, salt);
            user = yield user_model_1.default.create({
                email: email,
                password: encryptedPassword,
                name: name
            });
        }
        // Create JWT tokens
        const accessToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
        const refreshToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET);
        // Save the refresh token in the database
        user.tokens = [];
        user.tokens.push(refreshToken);
        yield user.save();
        return res.status(200).send({ 'user': user, 'accessToken': accessToken, 'refreshToken': refreshToken });
    }
    catch (error) {
        console.error('Error in Google callback:', error);
    }
});
const changeProfilePicture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    let photo;
    // Check if req.file exists and set photo accordingly
    if (req.file) {
        const relativePath = path_1.default.relative('src/public/image', req.file.path);
        photo = relativePath.replace(/\\/g, '/'); // Convert backslashes to forward slashes for consistency
    }
    try {
        const user = yield user_model_1.default.findOneAndUpdate({ name: name }, { photo: photo }, { new: true });
        if (user === null) {
            return res.status(401).send("user not found");
        }
        yield post_model_1.default.updateMany({ name: name }, { profilePic: photo }, { new: true });
        return res.status(200).send(user);
    }
    catch (_a) {
        return res.status(500);
    }
});
const allUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find();
        return res.status(200).send(users);
    }
    catch (_b) {
        return res.status(500);
    }
});
module.exports = {
    login,
    register,
    changeProfilePicture,
    logout,
    refreshToken,
    userInfo,
    findOrCreateGoogleUser,
    allUsers
};
//# sourceMappingURL=auth_controller.js.map