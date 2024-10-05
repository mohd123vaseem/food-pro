
import orderModel from "../models/orderModel.js";

import Stripe from "stripe";
import userModel from "../models/userModel.js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = "https://food-pro-frontend.onrender.com";

  try {
    // Check if required fields are present
    const { userId, items, amount, address } = req.body;
    if (!userId || !items || !amount || !address) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100 * 80, // MULTIPLY BY 80 TO CONVERT DOLLAR TO RUPEE
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100 * 80, // MULTIPLY BY 80 TO CONVERT DOLLAR TO RUPEE
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error processing order" });
  }
}
//verifying whether payment had been done of the order
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { payment: true }, { new: true });
      if (!updatedOrder) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      res.json({ success: true, message: "Paid" });
    } else {
      const deletedOrder = await orderModel.findByIdAndDelete(orderId);
      if (!deletedOrder) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.error('Error verifying order:', error);
    res.status(500).json({ success: false, message: "Error verifying order" });
  }
}

//generating a list of user order for frontend

const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const orders = await orderModel.find({ userId });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

//Listing all users for admin panel
const listOrders=async(req,res)=>{
    try {
      const orders=await orderModel.find({});
      res.json({success:true,data:orders})
    } catch (error) {
      console.log(error);
      res.json({success:false,message:"Error"})
      
    }

}
//api for updating order status
const updateStatus=async(req,res)=>{
      try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Status Updated"})
      } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
      }

}




export { placeOrder,verifyOrder,userOrders,listOrders,updateStatus };
