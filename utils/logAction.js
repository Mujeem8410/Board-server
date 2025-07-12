import ActionLog from '../models/ActionLog.js';

export const logAction = async ({ userId, taskId, actionType, message }) => {
  try {
    await ActionLog.create({
      user: userId,
      task: taskId,
      actionType,
      message,
    });
  } catch (err) {
    console.error('Action logging failed:', err.message);
  }
};
