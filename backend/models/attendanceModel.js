import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  classDate: Date,
  classCode: { type: String, unique: true },
  attendanceRecords: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    signInTime: Date,
    signOutTime: Date,
    present: Boolean
  }],
}, { timestamps: true });

export default mongoose.model('Attendance', AttendanceSchema);
