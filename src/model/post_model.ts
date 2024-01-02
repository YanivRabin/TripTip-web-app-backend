import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    owner: { type: String, require: true },
    title: { type: String, require: true },
    description: { type: String },
    photo: { type: String },
    comments: [{
         comment: { type: String } 
    }]
});

export = mongoose.model('Post', userSchema);