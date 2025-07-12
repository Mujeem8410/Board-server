import mongoose from 'mongoose';

const actionLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    actionType: { type: String, enum: ['create', 'update', 'delete', 'assign'], required: true },
    message: { type: String },
  },
  { timestamps: true } // adds createdAt, updatedAt
);

export default mongoose.model('ActionLog', actionLogSchema);
