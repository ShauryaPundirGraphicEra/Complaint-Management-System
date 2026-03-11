import express from "express";

//import { createComment, deleteComment, editComment ,voteComment ,getComment}  from "../controller/post.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router=express.Router();

