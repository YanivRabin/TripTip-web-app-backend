import mongoose from "mongoose";


const postSchema = new mongoose.Schema({
    name: { type: String, require: true },
    description: { type: String },
    photo: { type: String },
    profilePic: { type: String, default: null },
    comments: [{
        user: { type: String, require: true },
        comment: { type: String, require: true } 
    }]
});

export = mongoose.model('Post', postSchema);