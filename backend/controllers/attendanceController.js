import Attendance from '../models/attendanceModel.js';
import Subject from '../models/subjectModel.js';

//STUDNET mark attenadace
export const markAttendance = async (req, res) => {
  try {
    const {
      subjectId,
      classDate,
      classCode,
      attendanceRecords,
    } = req.body;

    // Verify teacher owns the subject
    // const subject = await Subject.findOne({ _id: subjectId, teacher: req.user._id });
    // if (!subject) {
    //   return res.status(403).json({ message: 'Not authorized to mark attendance for this subject' });
    // }

    // Find attendance document for this classCode/session
    let attendance = await Attendance.findOne({ subject: subjectId, classCode });

    if (!attendance) {
      // Create new attendance document if not found
      attendance = new Attendance({
        subject: subjectId,
        classDate: new Date(classDate),
        classCode,
        attendanceRecords: [],
      });
    }

    // Process each record - convert string dates to Date objects
    const processedRecords = attendanceRecords.map(record => ({
      student: record.student,
      signInTime: record.signInTime ? new Date(record.signInTime) : null,
      signOutTime: record.signOutTime ? new Date(record.signOutTime) : null,
      present: record.present !== undefined ? record.present : true,
    }));

    // Append new attendanceRecords array - allows adding multiple records at once
    attendance.attendanceRecords.push(...processedRecords);

    await attendance.save();

    res.status(201).json({ message: 'Attendance successfully marked', attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
//studnet mark atteandacne



// Get attendance records for a subject
export const getAttendanceBySubject = async (req, res) => {
  try {
    const subjectId = req.params.subjectId;

    // Check if user is teacher for subject or admin
    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    if (req.user.role !== 'admin' && !(req.user.role === 'teacher' && subject.teacher.equals(req.user._id))) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const attendanceRecords = await Attendance.find({ subject: subjectId }).populate('attendanceRecords.student', 'name email');
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get attendance for a student across subjects
export const getAttendanceByStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Only student themselves or admin can view
    if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const attendanceRecords = await Attendance.find({ 'attendanceRecords.student': studentId }).populate('subject', 'name');
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET /api/attendance/teacher/:teacherId?classId=&date=
export const getAttendanceForTeacher = async (req, res) => {
  try {
    const teacherId = req.params.teacherId; // This should be MongoDB ObjectId
    const { classId, date } = req.query;

    // Find subjects taught by this teacher
    const subjects = await Subject.find({ teacher: teacherId });
    const subjectIds = subjects.map(sub => sub._id.toString());

    // Make sure classId is _id, not name
    if (classId && !subjectIds.includes(classId)) {
      return res.status(403).json({ message: 'Access denied: You do not teach this class.' });
    }

    let filter = {};
    if (classId) {
      filter.subject = classId;
    } else {
      filter.subject = { $in: subjectIds };
    }

    if (date) {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      filter.classDate = { $gte: dayStart, $lte: dayEnd };
    }

    const attendanceRecords = await Attendance.find(filter)
      .populate('subject', 'name')
      .populate('attendanceRecords.student', 'name email')
      .sort({ classDate: -1 });

    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};