import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // hashed
  role: { type: String, enum: ['admin', 'teacher', 'student'], required: true },
  approved: { type: Boolean, default: false }, // Admin approval required
  enrolledSubjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }], // for students
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
