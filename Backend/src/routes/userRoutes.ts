import { Router } from "express";
import { authentication } from "../middleware/authentication.js";
import { getUser } from "../controllers/User/getUser.js";

const router = Router();
router.use(authentication);


router.get("/me", getUser);


export default router;
