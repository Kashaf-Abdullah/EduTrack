import mongoose from 'mongoose';

const ResultSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  marks: Number,
  comments: String,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Result', ResultSchema);
