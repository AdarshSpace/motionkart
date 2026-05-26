import express from 'express';
import { generateUploadAuth } from '../lib/imagekit.js';
import { authentication } from '../middleware/authentication.js';
import {handleCreateUploadUrl} from "../controllers/Mux/createUpload.js"


const router = express.Router();
router.use(authentication);

router.get('/auth', generateUploadAuth);
router.post('/create', handleCreateUploadUrl);



export default router;