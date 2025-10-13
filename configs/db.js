import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
mongoose.connect(process.env.MONGOBD_URL);
export const db=mongoose.connection;
db.on('connected',(err)=>{
    if(err){
        console.log(err);        
    }else{
        console.log("Database Connected");        
    }
});