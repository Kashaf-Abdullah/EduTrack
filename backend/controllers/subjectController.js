import Subject from '../models/subjectModel.js';

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
    } else {
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
