import { courseControllers } from "../../modules/courses";
import express, { Router } from "express";


const router: Router = express.Router();

router.get("/", courseControllers.webhook);
router.post("/", courseControllers.postWebhook);

export default router