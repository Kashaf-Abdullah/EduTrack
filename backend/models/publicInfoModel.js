import mongoose from 'mongoose';

const PublicInfoSchema = new mongoose.Schema({
  title: String,
  content: String,
  visible: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('PublicInfo', PublicInfoSchema);
