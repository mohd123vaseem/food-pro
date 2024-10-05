import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'

import validator from "validator"

import bcrypt from "bcrypt"

//login user

const loginUser=async (req,res) =>{
   const {email,password}=req.body;
    try{
        const user=await userModel.findOne({email});
        //checking if user already exists
        if(!user){
            return res.json({success:false,message:"User doesnot exists"})
        }

        const isMatch=await bcrypt.compare(password,user.password);
        
        if(!isMatch){
            return res.json({success:false,message:"Invalid Credentials"})
        }

        const token=createToken(user._id);
        return res.json({success:true,token})


    }catch(error){
        console.log(error);
        return res.json({success:false,message:"Error"})
    }
}

const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

//register/signup user

const registerUser= async(req,res)=>{
   
    const {name,password,email}=req.body;
    try{
        const exists=await userModel.findOne({email});
        //checking if user already exists
        if(exists){
            return res.json({success:false,message:"User already exists"})
        }
        //validating if email is correct or not
        
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please enter a valid email"})
        }

        if(password.length<8){
            return res.json({success:false,message:"Enter enter a strong min 8 char password"})
        }
        //hashing user password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser=new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })

       const user= await newUser.save()
       const token=createToken(user._id);
       return res.json({success:true,token})

    }catch(error){
        console.log(error);
        return res.json({success:false,message:"Error"})
    }


}

export {
    loginUser,
    registerUser
}