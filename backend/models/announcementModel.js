import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema({
  type: { type: String, enum: ['best-student', 'best-teacher'], required: true },
  title: { type: String, required: true }, // e.g., "Best Student of November 2025"
  description: { type: String }, // e.g., details or reasons for award
  featuredUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ref to student or teacher user
  announcedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // admin user who announced
  dateAnnounced: { type: Date, default: Date.now },
  visible: { type: Boolean, default: true }, // whether announcement is public
}, { timestamps: true });

export default mongoose.model('Announcement', AnnouncementSchema);
