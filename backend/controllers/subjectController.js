import Subject from '../models/subjectModel.js';
import User from '../models/userModel.js';
import { v4 as uuidv4 } from 'uuid';
    const uniqueClassCode = uuidv4(); 
// Create a new subject (teacher or admin)
export const createSubject = async (req, res) => {
  try {
    const { name, description, classTimings, courseContent } = req.body;
    const teacher = req.user._id;

    const subject = new Subject({
      name,
      description,
      teacher,
      classTimings,
      courseContent,
      students: [],
        classCode: uniqueClassCode 
    });

    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all subjects (admin or teacher's own subjects)
export const getSubjects = async (req, res) => {
  try {
    let subjects;
    if (req.user.role === 'admin') {
      subjects = await Subject.find().populate('teacher', 'name email');
    } else if (req.user.role === 'teacher') {
      subjects = await Subject.find({ teacher: req.user._id }).populate('students', 'name email');
    }
    else if (req.user.role === 'student') {
  subjects = await Subject.find({ students: { $ne: req.user._id } }).populate('teacher', 'name email');
}
    else {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single subject by ID (teacher or admin)
export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate('teacher', 'name email').populate('students', 'name email');
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    if (req.user.role === 'admin' || (req.user.role === 'teacher' && subject.teacher._id.equals(req.user._id))) {
      return res.json(subject);
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const addStudentToSubject = async (req, res) => {
  try {
    const subjectId = req.params.id;
    const { studentId } = req.body;

    // Optional: check if user is teacher/admin and owns this subject

    const updatedSubject = await Subject.findByIdAndUpdate(
      subjectId,
      { $addToSet: { students: studentId } }, // prevents duplicates
      { new: true }
    ).populate('students', 'name email');

    if (!updatedSubject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json(updatedSubject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update subject (only teacher who owns it or admin)
export const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    if (req.user.role !== 'admin' && !(req.user.role === 'teacher' && subject.teacher.equals(req.user._id))) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, description, classTimings, courseContent } = req.body;
    if (name) subject.name = name;
    if (description) subject.description = description;
    if (classTimings) subject.classTimings = classTimings;
    if (courseContent) subject.courseContent = courseContent;

    await subject.save();
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete subject (only teacher who owns it or admin)
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    if (req.user.role !== 'admin' && !(req.user.role === 'teacher' && subject.teacher.equals(req.user._id))) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await subject.deleteOne();
    res.json({ message: 'Subject deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getSubjectsForStudent = async (req, res) => {
  try {
    const studentId = req.user._id;
    const subjects = await Subject.find({ students: studentId })
      .populate('teacher', 'name email')
      .populate('students', 'name email');
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Assuming you have Student and Subject models
// Student: { _id, name, subjects: [subjectId, ...] }
// Subject: { _id, name }

// export const getAllStudentSubjectDetailsForAdmin = async (req, res) => {
//   try {
//     // Get all students (users that have student role)
//     const students = await User.find({ role: 'student' }).lean();

//     // Get all subjects, mapped by student
//     const subjects = await Subject.find({}, 'name students').lean();

//     // Build a lookup: studentId -> [subject names]
//     const studentSubjectsMap = {};
//     subjects.forEach(subject => {
//       (subject.students || []).forEach(studentId => {
//         if (!studentSubjectsMap[studentId]) studentSubjectsMap[studentId] = [];
//         studentSubjectsMap[studentId].push(subject.name);
//       });
//     });

//     // Build result for each student
//     const result = students.map(student => ({
//       id: student._id,
//       name: student.name,
//       subjects: (studentSubjectsMap[student._id.toString()] || []).join(', ')
//     }));

//     res.json(result);
//   } catch (err) {
//     console.error('Admin/student subjects controller error:', err);
//     res.status(500).json({ error: err.message || 'Server error' });
//   }
// };

export const getAllStudentSubjectDetailsForAdmin = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).lean();
    const subjects = await Subject.find({}, 'name students').lean();

    // Build subject array for each student
    const result = students.map(student => {
      const subjectList = subjects
        .filter(sub => (sub.students || []).map(id => id.toString()).includes(student._id.toString()))
        .map(sub => ({ id: sub._id, name: sub.name }));
      return {
        id: student._id,
        name: student.name,
        subjects: subjectList
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
};





// Remove student from subject
export const removeStudentFromSubject = async (req, res) => {
  try {
    const { subjectId, studentId } = req.body; // pass both as POST body
    const subject = await Subject.findByIdAndUpdate(
      subjectId,
      { $pull: { students: studentId } },
      { new: true }
    );
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json({ message: 'Student removed from subject' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete student user
export const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    // Remove student from all subjects
    await Subject.updateMany({}, { $pull: { students: studentId } });
    // Remove from users
    await User.findByIdAndDelete(studentId);
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
