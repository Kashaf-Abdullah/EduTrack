import Result from '../models/resultModel.js';
import Subject from '../models/subjectModel.js';

// Add or update result for a student in a subject
export const addOrUpdateResult = async (req, res) => {
  try {
    const { subjectId, studentId, marks, comments } = req.body;
    const teacherId = req.user._id;

    // Verify if teacher owns the subject
    const subject = await Subject.findOne({ _id: subjectId, teacher: teacherId });
    if (!subject) {
      return res.status(403).json({ message: 'You are not authorized to add results for this subject.' });
    }

    // Check if result already exists for the student & subject, update if yes
    let result = await Result.findOne({ subject: subjectId, student: studentId });

    if (result) {
      result.marks = marks;
      result.comments = comments;
      await result.save();
    } else {
      result = new Result({
        subject: subjectId,
        student: studentId,
        marks,
        comments,
        teacher: teacherId,
      });
      await result.save();
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get results for a student for all subjects or a specific subject
export const getResultsForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subjectId } = req.query;
    
    // Only the student themselves or their teacher/admin can get results
    if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    let query = { student: studentId };
    if (subjectId) {
      query.subject = subjectId;
    }

    const results = await Result.find(query)
      .populate('subject', 'name')
      .populate('teacher', 'name');

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
