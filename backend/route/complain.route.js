import express from "express";

import { createComplaint,supportComplaint,getComplaint,getComplaints,getMyComplaints,deleteComplaint,reviewComplaint }  from "../controller/complain.controller.js";

import { authMiddleware,isGovernmentEmployee } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router=express.Router();

router.post("/complaint",authMiddleware,upload.array("images", 5),createComplaint);
router.post("/support/:complaintId",authMiddleware,supportComplaint);
router.get("/complaint/:complaintId",authMiddleware,getComplaint);
router.get("/complaints",getComplaints);
router.get("/mycomplaints",authMiddleware,getMyComplaints);
router.delete("/delete/:complaintId",authMiddleware,deleteComplaint);
router.post("/review/:complaintId",isGovernmentEmployee,reviewComplaint);

export default router;

