import mongoose from "mongoose";
import Product from "../models/product.js";
import products from "./data.js";

const seedProducts = async () => {

   try {

    await mongoose.connect("mongodb+srv://lastjokerktk:qbYtRVPsuUMad8nO@cluster0.kwa8l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

    await Product.deleteMany();
    console.log("Products deleted");

    await Product.insertMany(products);
    console.log("Products added");

    process.exit();
    
   } catch (error) {
    
    console.log(error.message);
    process.exit();

   }

}

// invoke the function here
seedProducts();