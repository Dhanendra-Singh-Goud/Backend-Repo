import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true,limit:"20kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//import of router
import router from './routes/user.routes.js';

//declaration of router
app.use("/api/v1/users",router)

//http://localhost:5220/api/v1/users/register
export default app;