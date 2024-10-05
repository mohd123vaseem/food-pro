

import foodModel from "../models/foodModel.js";

import fs from 'fs'


const addFood= async (req,res) => {
    let image_filename=`${req.file.filename}`

    const food=new foodModel({
        name: req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename
    })
      try{
         await food.save();
         res.json({success:true,message:"food added"})
      }catch(error){
           console.log(error);
           res.json({success:false,message:"Error"})
      }
}

//list all food
const listFood=async(req,res)=>{
       try{
          const foods=  await foodModel.find({});
          res.json({success:true,data:foods})
       }catch(error){
             console.log(error);
             res.json({success:false,message:"Error"})
       }
}

//To search any food item
const searchFood=async(req,res)=>{
   try{
      const foods = await foodModel.find({ 
         name: { $regex: `${req.body.name}`, $options: 'i' } 
     });
     

      res.json({success:true,data:foods})
   }catch(error){
         console.log(error);
         res.json({success:false,message:"Error"})
   }
}


//remove any food item
const removeFood= async(req,res) =>{
       try{
        const food=await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{})//to delete the image of food from uploads folder

        await foodModel.findByIdAndDelete(req.body.id)//to delete food entry from mongoDB
        res.json({success:true,message:"Food Removed"})
       }
       catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
       }
}

export {addFood,listFood,removeFood,searchFood}
