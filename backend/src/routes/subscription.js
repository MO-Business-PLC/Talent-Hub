import express from "express";
import { subscribeEmail, getSubscriptions } from "../controllers/subscriptionController.js";
import { auth, authorize } from "../middleware/auth.js";
const router = express.Router();

router.post("/", subscribeEmail);
//get all subsriber only by admin
router.get("/",  auth, authorize("admin"), getSubscriptions);

export default router;