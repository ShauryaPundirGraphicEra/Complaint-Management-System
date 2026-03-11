import express from "express";

import {signup,signin, getUserProfile}  from "../controller/user.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.post("/signup",  upload.single("image"), signup);
router.post("/signin",signin);
router.get("/profile/:id", authMiddleware, getUserProfile);

// to fixthe signin,auth middleware understand when to do,


export default router;