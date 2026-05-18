import { Router } from 'express';
import sessionController from '../controllers/session.js';

const router = Router();

router.get('/', sessionController.getSession);
router.post('/', sessionController.login);
router.post('/refresh', sessionController.refresh);
router.post('/logout', sessionController.logout);

export default router;