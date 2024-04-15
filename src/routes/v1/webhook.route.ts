import { WhatsappController } from "../../modules/whatsapp";
import express, { Router } from "express";


const router: Router = express.Router();

router.get("/", WhatsappController.webhook);

router.post("/", WhatsappController.postWebhook);

router.get("/send-invitation", WhatsappController.sendCourseInvitation)

export default router