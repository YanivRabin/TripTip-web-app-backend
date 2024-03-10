import { Request, Response } from "express";
import Post from '../model/post_model';
import User from '../model/user_model';


const getAllPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find();
        return res.status(200).send(posts);
    } catch {
        return res.status(400);
    }
}

const getPostsByName = async (req: Request, res: Response) => {
    try {
        // const user = await User.findById(req.params.id);
        const posts = await Post.find({name: req.params.name});
        if (posts === null) {
            return res.status(401).send("there is no posts");
        }
        return res.status(200).send(posts);
    } catch {
        return res.status(400);
    }
}

const getPostById = async (req: Request, res: Response) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (post === null) {
            return res.status(401).send("post not found");
        }
        return res.status(200).send(post);
    } catch {
        return res.status(400);
    }
}

const createPost = async (req: Request, res: Response) => {
    const name = req.body.name;
    const description = req.body.description;
    const photo = req.file.path.replace('src/public/', '');
        
    if (!description && !photo) {
        return res.status(400).send("description or photo is required");
    }
    try {
        const user = await User.findOne({ name: name });
        if (user === null) {
            return res.status(401).send("user not found");
        }
        // save post and update user posts
        const post = new Post({
            name: name,
            description: description,
            photo: photo,
        });        
        await post.save();
        user.posts.push(post);
        await user.save();
        return res.status(200).send(post);
    } catch {
        console.log("error");
        return res.status(500);
    }
}

const updatePost = async (req: Request, res: Response) => {
    const id = req.params.id;
    const description = req.body.description;
    const photo = req.file;
    if (!description && !photo) {
        return res.status(400).send("description or photo is required");
    }
    try {
        const post = await Post.findOneAndUpdate(
            { _id: id },
            { description: description, photo: photo },
            { new: true }
        );
        if (post === null) {
            return res.status(401).send("post not found");
        }
        return res.status(200).send(post);
    } catch {
        return res.status(500);
    }
}

const deletePost = async (req: Request, res: Response) => {
    const postId = req.params.postId;
    try {
        const deletePost = await Post.findByIdAndDelete(postId);
        if (!deletePost) {
            return res.status(401).send("post not found");
        }
        const user = await User.findOne({ name: deletePost['name'] });
        if (user === null) {
            return res.status(401).send("user not found");
        }
        user.posts.pull(deletePost);
        await user.save();
        return res.status(200).send("post deleted");
    } catch {
        return res.status(500);
    }
}

const commentPost = async (req: Request, res: Response) => {
    const postId = req.params.postId;
    const user = req.body.user;
    const comment = req.body.comment;
    if (!user || !comment) {
        return res.status(400).send("user and comment are required");
    }
    try {
        const post = await Post.findById(postId);
        if (post === null) {
            return res.status(401).send("post not found");
        }
        post.comments.push(req.body);
        await post.save();
        return res.status(200).send(post);
    } catch {
        return res.status(500);
    }
}

const getPostComments = async (req: Request, res: Response) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findById(postId);
        if (post === null) {
            return res.status(401).send("post not found");
        }
        return res.status(200).send(post.comments);
    } catch {
        return res.status(500);
    }
}

export = {
    getAllPosts,
    getPostsByName,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    commentPost,
    getPostComments,
}