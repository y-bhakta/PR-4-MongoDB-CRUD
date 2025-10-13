import express from "express"
import dotenv from "dotenv"
import { db } from "./configs/db.js"
dotenv.config();
const app=express();
const port=process.env.PORT||8081;
app.listen(port,(err)=>{
    db
    if(err){
        console.log(err);        
    }
    console.log("Server Stared At port http://127.0.0.1:"+port);
});