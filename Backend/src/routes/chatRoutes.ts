import { Router } from "express";
import { authentication } from "../middleware/authentication.js";
import { askAi } from "../controllers/Chat/chat.js";
import { getChat } from "../controllers/Chat/fetchChat.js";

const router = Router();

router.use(authentication);

router.post("/ask", askAi);
router.get("/fetch/:courseId/:videoId", getChat);


export default router;
