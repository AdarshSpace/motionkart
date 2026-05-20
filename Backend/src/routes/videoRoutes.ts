import express from 'express';
import { generateUploadAuth } from '../lib/imagekit.js';
import { authentication } from '../middleware/authentication.js';

const router = express.Router();
router.use(authentication);

router.get('/auth', generateUploadAuth);


export default router;