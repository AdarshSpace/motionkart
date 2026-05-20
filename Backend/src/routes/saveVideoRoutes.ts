import { Router } from "express";
import { authentication } from "../middleware/authentication.js";
import { CheckSaved, GetSavedVideos, SaveVideo, UnsaveVideo } from "../controllers/Save/saveVideo.js";

const router = Router();

router.use(authentication);

router.post("/save", SaveVideo);
router.delete("/saved/:videoId", UnsaveVideo);
router.get("/saved/:videoId/check", CheckSaved);
router.get("/saved", GetSavedVideos);


export default router;

