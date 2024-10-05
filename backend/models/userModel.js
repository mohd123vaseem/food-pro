import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name: {type:String,required:true},
    email: {type:String,required:true,unique:true},
    password: {type:String,required:true},
    cartData: {type:Object,default:{}},
},{minimize:false})

{/*This option tells Mongoose to not minimize the schema when saving documents to the database. By default, Mongoose will remove empty objects and arrays from documents to save space. However, in this case, we want to preserve even empty cartData objects, so minimize: false is used. */}

const userModel=mongoose.models.user || mongoose.model("user",userSchema);

export default userModel;