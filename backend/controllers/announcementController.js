import Announcement from '../models/announcementModel.js';
import User from '../models/userModel.js';
import { notifyAnnouncement } from './notificationController.js';

// Admin creates announcement
export const createAnnouncement = async (req, res) => {
  try {
    const { type, title, description, featuredUser, visible } = req.body;

    // Validate admin role here or by middleware

    const announcement = new Announcement({
      type,
      title,
      description,
      featuredUser,
      announcedBy: req.user._id,
      visible: visible !== undefined ? visible : true,
    });

    await announcement.save();

    // Get all teachers and students for notification
    const teachers = await User.find({ role: 'teacher' });
    const students = await User.find({ role: 'student' });

    const teacherIds = teachers.map(t => t._id);
    const studentIds = students.map(s => s._id);

    // Notify all teachers and students about new announcement
    await notifyAnnouncement(teacherIds, studentIds, title);

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public fetch announcements
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ visible: true })
      .populate('featuredUser', 'name role')
      .sort({ dateAnnounced: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
