// require('dotenv').config({path:'./.env'})
import dotenv from 'dotenv'
// import mongoose from "mongoose";
// import { DB_NAME } from "./constant.js";
// import express from "express";
import DB_CONNECT from "./db/dbIndex.js";
import app from "./app.js";

dotenv.config({path:'./.env'});
DB_CONNECT()
.then(()=>{
    app.listen(process.env.PORT || 8080 , ()=>{
        console.log(`app listening on port ${process.env.PORT}`)
    })
    app.on((error)=>{
        console.log(`Error may be in express server ${error}`)
    })
})
.catch((error)=>{
    console.log(`Error connection failed: ${error}`)
})







// 2nd approach for connecting db from monngoose


// const app = express()
// (async()=>{
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//         app.on((error) =>{
//             console.log("Error on may bein Express", error)
//             throw error
//         })

//         app.listen(process.env.PORT,(error)=>{
//             console.log("App is listening on port",process.env.PORT)
//             throw error
//         })
//     }
//     catch(error){
//         console.log("ERROR : " + error)
//         throw error
//     }
// })()