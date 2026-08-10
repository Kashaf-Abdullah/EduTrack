import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Subject from '../models/subjectModel.js';

// Get all users pending approval
export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ approved: false }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApprovedUsers = async (req, res) => {
  try {
    const users = await User.find({ approved: true }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApprovedUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    if (!['student', 'teacher'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role parameter' });
    }

    const users = await User.find({ approved: true, role }).select('-password').lean();
    const subjects = await Subject.find().populate('teacher', 'name email').lean();

    if (role === 'student') {
      const subjectsByStudent = {};
      subjects.forEach((subject) => {
        (subject.students || []).forEach((studentId) => {
          const studentKey = studentId.toString();
          subjectsByStudent[studentKey] = subjectsByStudent[studentKey] || [];
          subjectsByStudent[studentKey].push({
            id: subject._id,
            name: subject.name,
            classCode: subject.classCode,
            teacherName: subject.teacher?.name || 'N/A',
            teacherEmail: subject.teacher?.email || 'N/A'
          });
        });
      });

      const result = users.map((user) => ({
        ...user,
        id: user._id.toString(),
        subjects: subjectsByStudent[user._id.toString()] || []
      }));
      return res.json(result);
    }

    const subjectsByTeacher = {};
    subjects.forEach((subject) => {
      const teacherId = subject.teacher?._id?.toString();
      if (!teacherId) return;
      subjectsByTeacher[teacherId] = subjectsByTeacher[teacherId] || [];
      subjectsByTeacher[teacherId].push({
        id: subject._id,
        name: subject.name,
        classCode: subject.classCode,
        studentCount: subject.students?.length || 0
      });
    });

    const result = users.map((user) => ({
      ...user,
      id: user._id.toString(),
      subjects: subjectsByTeacher[user._id.toString()] || []
    }));
    res.json(result);
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

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const impersonateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.approved) return res.status(400).json({ message: 'Cannot impersonate unapproved user' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
