import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { videoUpload } from "../controllers/video.controller.js"


const router = Router();
 
router.post("/upload",verifyJWT,upload.fields(
        [
        { name: 'videoFile', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
    ]),videoUpload
);



export default router;