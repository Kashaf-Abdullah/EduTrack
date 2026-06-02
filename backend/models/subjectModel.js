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
  classCode: { type: String, unique: true, required: true },
  // Approval fields
  approved: { 
    type: Boolean, 
    default: false 
  },
  approvedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  rejectionReason: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

export default mongoose.model('Subject', SubjectSchema);
