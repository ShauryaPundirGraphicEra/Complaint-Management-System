import express from "express";

import { createComplaint,supportComplaint,getComplaint,getComplaints,getMyComplaints,deleteComplaint,reviewComplaint }  from "../controller/complain.controller.js";

import { authMiddleware,isGovernmentEmployee } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router=express.Router();

router.route("/complaint",authMiddleware,upload.array("images", 5),createComplaint);
router.route("/support/:complaintId",authMiddleware,supportComplaint);
router.route("/complaint/:complaintId",authMiddleware,getComplaint);
router.route("/complaints",authMiddleware,getComplaints);
router.route("/mycomplaints",authMiddleware,getMyComplaints);
router.route("/delete/:complaintId",authMiddleware,deleteComplaint);
router.route("/review/:complaintId",isGovernmentEmployee,reviewComplaint);

export default router;

