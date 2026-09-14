import {registerUser} from "../controllers/user.controller.js"
import { Router } from "express"

const router=Router();

router.post("/register-user",registerUser);

export default router;