import express from 'express';
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  assignTaskToUser,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createTask);
router.get('/', protect, getTasks);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

// POST /tasks/:id/smart-assign
router.post('/:id/smart-assign', protect,assignTaskToUser);

export default router;
