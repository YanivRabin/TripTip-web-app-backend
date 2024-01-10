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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
        if (existUser != null) {
            return res.status(406).send("email already exists");
        }
        // encrypt password and save user
        const salt = yield bcrypt_1.default.genSalt(10);
        const encryptedPassword = yield bcrypt_1.default.hash(password, salt);
        const user = yield user_model_1.default.create({
            'email': email,
            'password': encryptedPassword,
            'name': name
        });
        return res.status(201).send(user);
    }
    catch (_a) {
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
        if (user.tokens === null) {
            user.tokens = [refreshToken];
        }
        else {
            user.tokens.push(refreshToken);
        }
        yield user.save();
        // send tokens to client
        return res.status(200).send({ 'accessToken': accessToken, 'refreshToken': refreshToken });
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
    jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // check if user exist
            const userDb = yield user_model_1.default.findById(user._id);
            if (userDb === null) {
                return res.sendStatus(403);
            }
            // remove token from db
            if (!userDb.tokens || !userDb.tokens.includes(token)) {
                userDb.tokens = [];
                yield userDb.save();
                return res.sendStatus(401);
            }
            else {
                userDb.tokens = userDb.tokens.filter(t => t !== token);
                yield userDb.save();
                console.log(userDb.tokens);
                return res.status(200).send(userDb);
            }
        }
        catch (err) {
            res.sendStatus(500);
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
            console.log("refresh token");
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
            res.status(200).send({ 'accessToken': accessToken, 'refreshToken': refreshToken });
        }
        catch (err) {
            res.status(500);
        }
    }));
});
module.exports = {
    login,
    register,
    logout,
    refreshToken
};
//# sourceMappingURL=auth_controller.js.map