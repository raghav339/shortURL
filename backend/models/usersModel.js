import mongoose from 'mongoose';

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:String
});

const model= mongoose.model("users",userSchema);

export default model;
