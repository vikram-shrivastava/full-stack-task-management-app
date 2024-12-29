import { Router } from "express";
import { loginuser, 
    logoutuser, 
    registeruser,
    refreshAccessToken,
    updateuserdetail,  } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=Router();
router.post("/register",registeruser)
router.post("/login",loginuser)
router.post("/logout",logoutuser)
router.post("/refresh-token",refreshAccessToken)
router.post("/update",verifyJWT,updateuserdetail)
export default router