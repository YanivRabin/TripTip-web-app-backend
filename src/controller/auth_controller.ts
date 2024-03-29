import { Request, Response } from "express";
import User from "../model/user_model";
import Post from "../model/post_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";

const register = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  if (!email || !password || !name) {
    return res.status(400).send("missing email, password or name");
  }
  try {
    // check if user exist
    const existUser = await User.findOne({ email: email });
    const existUser2 = await User.findOne({ name: name });
    if (existUser2 != null) {
      return res
        .status(406)
        .send("Name already exists - choose a different name");
    }
    if (existUser != null) {
      return res.status(406).send("Email already exists");
    }

    // encrypt password and save user
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      email: email,
      password: encryptedPassword,
      name: name,
    });
    // create tokens
    const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_REFRESH_SECRET
    );
    // save refresh token in db
    user.tokens = [];
    user.tokens.push(refreshToken);
    await user.save();
    // send tokens to client
    return res
      .status(201)
      .send({
        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
  } catch (err) {
    console.log("error: " + err.message);
    return res.status(500);
  }
};

const login = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send("missing email or password");
  }
  try {
    // check if user exist
    const user = await User.findOne({ email: email });
    if (user == null) {
      return res.status(401).send("email or password incorrect");
    }
    // check password is correct
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send("email or password incorrect");
    }
    // create tokens
    const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_REFRESH_SECRET
    );
    // save refresh token in db
    user.tokens = [];
    user.tokens.push(refreshToken);
    await user.save();
    // send tokens to client
    return res
      .status(200)
      .send({
        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
  } catch (err) {
    return res.status(500);
  }
};

const logout = async (req: Request, res: Response) => {
  // check if token exist
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (!token) {
    return res.sendStatus(401);
  }
  // check if token is valid
  jwt.verify(
    token,
    process.env.JWT_SECRET,
    async (err: { message: string }, user: { _id: string }) => {
      try {
        // check if user exist
        const userDb = await User.findById(user._id);
        if (userDb === null) {
          return res.sendStatus(403);
        }
        // remove token from db
        if (!userDb.tokens || !userDb.tokens.includes(token)) {
          userDb.tokens = [];
        } else {
          userDb.tokens = userDb.tokens.filter((t) => t !== token);
        }
        await userDb.save();
        console.log("userDb: ", userDb);

        return res.status(200).send(userDb);
      } catch (err) {
        return res.sendStatus(500);
      }
    }
  );
};

const refreshToken = async (req: Request, res: Response) => {
  // check if token exist
  const authHeaders = req.headers.authorization;
  const token = authHeaders && authHeaders.split(" ")[1];
  if (token === null) {
    return res.sendStatus(401);
  }
  // check if token is valid
  jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET,
    async (err: { message: string }, user: { _id: string }) => {
      if (err) {
        return res.status(403).send(err.message);
      }
      try {
        // check if user exist
        const userDb = await User.findById(user._id);
        if (userDb === null) {
          return res.status(403).send("invalid requset");
        }
        // check if token is valid
        if (userDb.tokens.includes(token) === null) {
          userDb.tokens = []; //invalidate all user tokens
          await userDb.save();
          return res.status(403).send("invalid requset");
        }
        // create new tokens and save in db
        const accessToken = jwt.sign(
          { _id: userDb._id },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRATION }
        );
        const refreshToken = jwt.sign(
          { _id: userDb._id },
          process.env.JWT_REFRESH_SECRET
        );
        userDb.tokens[userDb.tokens.indexOf(token)] = refreshToken;
        await userDb.save();
        // send tokens to client
        return res
          .status(200)
          .send({ accessToken: accessToken, refreshToken: refreshToken });
      } catch (err) {
        return res.status(500);
      }
    }
  );
};

const userInfo = async (req: Request & { user: { _id: string } }, res: Response) => {
  try {
    const user = await User.findById(req.user["_id"]);
    if (user === null) {
      return res.sendStatus(404);
    }
    return res.status(200).send(user);
  } catch (err) {
    return res.sendStatus(500);
  }
};

const findOrCreateGoogleUser = async (req: Request, res: Response) => {
  const email = req.body.email;
  const name = req.body.name;
  try {
    // Check if the user already exists in your database using email
    let user = await User.findOne({ email: email });
    if (!user) {
      // If the user doesn't exist, create a new user in the database
      const randomPassword = Math.random().toString(36).substring(7);
      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(randomPassword, salt);
      user = await User.create({
        email: email,
        password: encryptedPassword,
        name: name,
      });
    }
    // Create JWT tokens
    const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_REFRESH_SECRET
    );
    // Save the refresh token in the database
    user.tokens = [];
    user.tokens.push(refreshToken);
    await user.save();
    return res
      .status(200)
      .send({
        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
  } catch (error) {
    console.error("Error in Google callback:", error);
  }
};

const changeProfilePicture = async (req: Request, res: Response) => {
  const name = req.body.name;
  let photo;

  // Check if req.file exists and set photo accordingly
  if (req.file) {
    const relativePath = path.relative("src/public/image", req.file.path);
    photo = relativePath.replace(/\\/g, "/"); // Convert backslashes to forward slashes for consistency
  }
  try {
    const user = await User.findOneAndUpdate(
      { name: name },
      { photo: photo },
      { new: true }
    );

    if (user === null) {
      return res.status(401).send("user not found");
    }
    await Post.updateMany({ name: name }, { profilePic: photo }, { new: true });

    return res.status(200).send(user);
  } catch {
    return res.status(500);
  }
};

const changeName = async (req: Request, res: Response) => {
  const name = req.body.name;
  const newName = req.body.newName;
  try {
    const user = await User.findOneAndUpdate(
      { name: name },
      { name: newName },
      { new: true }
    );
    if (user === null) {
      return res.status(401).send("user not found");
    }
    await Post.updateMany({ name: name }, { name: newName }, { new: true });
    return res.status(200).send(user);
  } catch (error){
    return res.status(500).send(error.message);
  }
};

const allUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    return res.status(200).send(users);
  } catch {
    return res.status(500);
  }
};

export = {
  login,
  register,
  changeProfilePicture,
  logout,
  refreshToken,
  userInfo,
  findOrCreateGoogleUser,
  allUsers,
  changeName
};
