import Post from '../model/post_model';
import User from '../model/user_model';
import { Request, Response } from "express";


const uploadUserPhoto = async (req: Request, res: Response) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.id },
            { photo: req.file.filename },
            { new: true }
        );
        if (user === null) {
            return res.status(401).send("user not found");
        }
        return res.status(200).send(user);
    } catch {
        return res.status(400);
    }
}

const uploadPostPhoto = async (req: Request, res: Response) => {
    try {
        const post = await Post.findOneAndUpdate(
            { _id: req.params.postId },
            { photo: req.file.filename },
            { new: true }
        );
        if (post === null) {
            return res.status(401).send("post not found");
        }
        return res.status(200).send(post);
    } catch {
        return res.status(400);
    }
}

export = {
    uploadUserPhoto,
    uploadPostPhoto
};