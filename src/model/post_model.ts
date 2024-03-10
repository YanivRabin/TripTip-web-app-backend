import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: { type: String, require: true },
    description: { type: String },
    photo: { type: String },
    comments: [{
        user: { type: String, require: true },
        comment: { type: String, require: true } 
    }]
});

export = mongoose.model('Post', userSchema);