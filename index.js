require('dotenv').config()
const express = require('express')
const app = express()

const port = 3000;

app.get("/",(req,res)=>{
    res.send("Home page is availabe")
})

app.get('/profile',(req,res)=>{
    res.send("welcome to my profile")
})

app.listen(process.env.PORT,()=>{
    console.log(`here listen successfully on port ${port}`)
})