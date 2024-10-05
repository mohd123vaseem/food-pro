import mongoose from 'mongoose';

export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://muhammad123vaseem:7042954739Vaz@cluster0.dzxwi.mongodb.net/food_order123")
        .then(() => console.log('DB CONNECTED'))
        .catch((error) => console.log('DB CONNECTION ERROR:', error));
};
