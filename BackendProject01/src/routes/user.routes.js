import { Router } from "express";
// import { upload } from "../middlewares/multer.middlewares.js";
import {registerUser, loginUser, logoutUser, refreshAccessToken} from "../controllers/user.controllers.js";
import { verifyJwt } from "./auth.routes.js";

const router = Router();

router.route('/register').post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1,
        },
    ]),
    registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJwt, logoutUser)
router.route("/refresh-toke").post(refreshAccessToken)

export default router;