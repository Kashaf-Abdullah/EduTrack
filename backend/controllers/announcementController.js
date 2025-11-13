import Announcement from '../models/announcementModel.js';

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
