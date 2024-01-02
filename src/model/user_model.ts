import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    photo: { type: String },
    posts: [{
        post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
    }],
    refreshTokens: { type: [String], required: false }
});

export = mongoose.model('User', userSchema);