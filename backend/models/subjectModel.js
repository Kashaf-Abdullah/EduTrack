import mongoose from 'mongoose';

const SubjectSchema = new mongoose.Schema({
  name: String,
  description: String,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  classTimings: [{
    day: String,
    startTime: String,
    endTime: String,
  }],
  courseContent: String,
}, { timestamps: true });

export default mongoose.model('Subject', SubjectSchema);
