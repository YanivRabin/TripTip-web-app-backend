import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    photo: { type: String },
    posts: [{
        post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
    }],
    tokens: { type: [String] }
});

export = mongoose.model('User', userSchema);