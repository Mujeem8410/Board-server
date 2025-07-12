import Task from '../models/Task.js';
import User from '../models/User.js';
import { logAction } from '../utils/logAction.js';

export const createTask = async (req, res) => {
  const { title, description, status, priority, assignedTo } = req.body;
  const createdBy = req.user.id;

  try {
    const newTask = await Task.create({
      title,
      description,
      status,
      priority,
      assignedTo,
      createdBy,
    });

    res.status(201).json(newTask);

    // 🔥 Real-time
    const io = req.app.get('io');
    io.emit('taskUpdated');

    // 📝 Log
    await logAction({
      userId: createdBy,
      taskId: newTask._id,
      actionType: 'create',
      message: `${req.user.name} created task "${title}"`
    });

  } catch (err) {
    res.status(500).json({ message: 'Error creating task', error: err });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Task.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);

    const io = req.app.get('io');
    io.emit('taskUpdated');

    // 📝 Log
    await logAction({
      userId: req.user.id,
      taskId: updated._id,
      actionType: 'update',
      message: `${req.user.name} updated task "${updated.title}"`
    });

  } catch (err) {
    res.status(500).json({ message: 'Error updating task' });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    await Task.findByIdAndDelete(id);
    res.json({ message: 'Task deleted' });

    const io = req.app.get('io');
    io.emit('taskUpdated');

    // 📝 Log
    await logAction({
      userId: req.user.id,
      taskId: id,
      actionType: 'delete',
      message: `${req.user.name} deleted task "${task?.title || 'unknown'}"`
    });

  } catch (err) {
    res.status(500).json({ message: 'Error deleting task' });
  }
};

export const assignTaskToUser = async (req, res) => {
  try {
    const taskId = req.params.id;
    const users = await User.find();

    const userTaskCounts = await Promise.all(
      users.map(async (user) => {
        const count = await Task.countDocuments({
          assignedTo: user._id,
          status: { $ne: 'Done' },
        });
        return { userId: user._id, count };
      })
    );

    const minUser = userTaskCounts.reduce((min, curr) =>
      curr.count < min.count ? curr : min
    );

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { assignedTo: minUser.userId },
      { new: true }
    );

    res.json(updatedTask);

    const io = req.app.get('io');
    io.emit('taskUpdated');

    // 📝 Log
    await logAction({
      userId: req.user.id,
      taskId: taskId,
      actionType: 'assign',
      message: `${req.user.name} smart-assigned task "${updatedTask.title}"`
    });

  } catch (err) {
    console.error('Smart assign failed:', err);
    res.status(500).json({ error: 'Smart assign error' });
  }
};
