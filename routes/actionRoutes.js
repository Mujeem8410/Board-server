import express from 'express';
import { getLogs } from '../controllers/actionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', protect, getLogs);
export default router;
