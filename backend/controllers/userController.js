import User from '../models/userModel.js';

// Get all users pending approval
export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ approved: false });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApprovedUsers = async (req, res) => {
  try {
    const users = await User.find({ approved: true});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve a user
export const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.approved = true;
    await user.save();
    res.json({ message: 'User approved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
