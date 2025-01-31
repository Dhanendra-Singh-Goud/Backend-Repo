// require('dotenv').config();
import express from 'express';
import cors from "cors"; 

const app = express();
app.use(cors());
const port = process.env.PORT || 8000
app.get('/', (req, res) => {
    res.send("welcome home page")
})
app.get('/api/jokes',(req,res)=>{
    const jokes=[
        {
            id:1,
            title:"joke 1",
            content:"this is a first joke"
        },
        {
            id:2,
            title:"joke 2",
            content:"this is a Second joke"
        },
        {
            id:3,
            title:"joke 3",
            content:"this is a third joke"
        },
        {
            id:4,
            title:"joke 4",
            content:"this is a forth joke"
        },
        {
            id:5,
            title:"joke 5",
            content:"this is a fifth joke"
        }
    ]
    res.send(jokes)
})
app.listen(port,()=>{
    console.log("listening on port",port)
})