import multer from 'multer'; // Import the multer module for handling file uploads
import express from 'express'; // Import the express module
import { addFood, listFood, removeFood,searchFood } from '../controllers/foodController.js'; // Import the addFood function from the foodController.js file

const foodRouter = express.Router(); // Create a new router object

// IMAGE STORING ENGINE
const storage = multer.diskStorage({
    // Specifies the destination directory where the uploaded files will be stored
    destination: "uploads", // Folder where all images will be stored
    // Specifies the naming convention for the uploaded files
    filename: (req, file, cb) => {
        // cb is the callback function, similar to next() in middleware
        // It takes two arguments: error and the file name
        return cb(null, `${Date.now()}${file.originalname}`); // Prefixes the file name with the current timestamp
    }
});

const upload = multer({ storage: storage }); // Create an upload middleware using the storage engine defined above

// Route to handle adding food items
// Uses the upload middleware to handle the image file in the request
// The "single" method specifies that we're expecting a single file upload with the field name "image"
foodRouter.post("/add", upload.single("image"), addFood);

foodRouter.get("/list",listFood)

foodRouter.post("/remove",removeFood)

foodRouter.post("/search",searchFood);

export default foodRouter; // Export the router to be used in other parts of the application
