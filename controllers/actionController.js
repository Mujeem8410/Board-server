import ActionLog from '../models/ActionLog.js';

export const getLogs = async (req, res) => {
  try {
    const logs = await ActionLog.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('user', 'name')
      .populate('task', 'title');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching logs' });
  }
};
