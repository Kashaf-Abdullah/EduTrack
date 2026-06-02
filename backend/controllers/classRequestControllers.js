import ClassRequest from '../models/classRequest.js';
import Subject from '../models/subjectModel.js';
import {
  notifyClassRequest,
  notifyClassRequestUpdate,
  notifyClassRequestSubmitted
} from './notificationController.js';

// Student submits a join request
export const submitClassRequest = async (req, res) => {
  try {
    const { studentId, classId } = req.body;

    const existingRequest = await ClassRequest.findOne({ student: studentId, class: classId });
    if (existingRequest) {
      return res.status(400).json({ message: 'Request already exists' });
    }

    const request = new ClassRequest({ student: studentId, class: classId });
    await request.save();

    // Populate student and class for notification
    await request.populate('student', 'name email');
    await request.populate('class', 'name');

    // Send notification to student (confirmation)
    await notifyClassRequestSubmitted(studentId, request.class.name);

    // Send notification to teacher
    await notifyClassRequest(studentId, classId, request.student.name, request.class.name);

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Teacher gets pending requests for their classes
// In your classRequestControllers.js - ensure proper ID handling
export const getPendingRequestsForTeacher = async (req, res) => {
  try {
    const teacherId = req.params.teacherId;

    // Add validation for teacherId
    if (!teacherId || teacherId === 'undefined') {
      return res.status(400).json({ message: 'Invalid teacher ID' });
    }

    // Find all classes owned by teacher
    const classes = await Subject.find({ teacher: teacherId });
    const classIds = classes.map(c => c._id);

    // Find all pending requests for those classes
    const requests = await ClassRequest.find({ 
      class: { $in: classIds }, 
      status: { $in: ['pending', 'rejected'] } // Include both statuses
    })
      .populate('student', 'name email')
      .populate('class', 'name');

    res.json(requests);
  } catch (error) {
    console.error('Error in getPendingRequestsForTeacher:', error);
    res.status(500).json({ message: error.message });
  }
};

// Teacher approves a request (assigns student to class)
export const approveClassRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId;

    const request = await ClassRequest.findById(requestId)
      .populate('student', 'name email')
      .populate('class', 'name');
    
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Add student to subject's students array if not already
    const subject = await Subject.findById(request.class._id);
    if (!subject.students.includes(request.student._id)) {
      subject.students.push(request.student._id);
      await subject.save();
    }

    request.status = 'approved';
    await request.save();

    // Send notification to student
    await notifyClassRequestUpdate(request.student._id, 'approved', request.class.name);

    res.json({ message: 'Request approved and student assigned to class' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Optional: reject request
export const rejectClassRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const request = await ClassRequest.findById(requestId)
      .populate('student', 'name email')
      .populate('class', 'name');
      
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'rejected';
    await request.save();

    // Send notification to student
    await notifyClassRequestUpdate(request.student._id, 'rejected', request.class.name);

    res.json({ message: 'Request rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Controller
export const getRequestsByStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const requests = await ClassRequest.find({ student: studentId })
      .populate('class', 'name')
      .populate('student', 'name email');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

