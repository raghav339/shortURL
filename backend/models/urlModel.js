import mongoose from 'mongoose';

const urlSchema= new mongoose.Schema({
    shortURL:String,
    orgURL:String,
    checks:Number,
    username:String,
    expireAt:{
        type:Date,
        required:true,
        expires:0
    }
});

const model= mongoose.model("urlData",urlSchema);

export default model;
