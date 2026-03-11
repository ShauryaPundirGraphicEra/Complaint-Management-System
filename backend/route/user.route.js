import express from "express";

import {signup,signin}  from "../controller/user.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.post("/signup",  upload.single("image"), signup);
router.post("/signin",signin);

// to fixthe signin,auth middleware understand when to do,


export default router;