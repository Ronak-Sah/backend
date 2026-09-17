import { Router } from "express";
import { subscribeChannel,subscriberCount,unsubscribe } from "../controllers/subscriptions.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";


const router = Router();

router.get("/:id/subscribeChannel",verifyJWT,subscribeChannel);
router.get("/:id/subscribeCount",verifyJWT,subscriberCount);
router.get("/:id/unsubscribe",verifyJWT,unsubscribe)

export default router;