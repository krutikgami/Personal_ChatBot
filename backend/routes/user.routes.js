import {Router} from 'express';
import userController from '../controllers/user.controller.js';
const router = Router();

router.post('/api/chat', userController);

export default router;