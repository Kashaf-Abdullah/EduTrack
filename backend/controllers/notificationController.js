import Notification from '../models/notificationModel.js';
import Subject from '../models/subjectModel.js';
import User from '../models/userModel.js';

// Get all notifications for a user
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { unreadOnly = false, limit = 20, skip = 0 } = req.query;

    let query = { recipient: userId };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('relatedData.userId', 'name email')
      .populate('relatedData.subjectId', 'name')
      .exec();

    const totalCount = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ 
      recipient: userId, 
      isRead: false 
    });

    res.json({ 
      notifications, 
      totalCount, 
      unreadCount 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.params.userId;

    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to create notification
export const createNotification = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Helper function to emit class request submitted notification (to student - confirmation)
export const notifyClassRequestSubmitted = async (studentId, className) => {
  try {
    await createNotification({
      recipient: studentId,
      type: 'class_request',
      title: `Request Submitted ✓`,
      message: `Your request to join ${className} has been submitted and is pending teacher approval`,
      actionUrl: `/dashboard/student/class-request`
    });
  } catch (error) {
    console.error('Error in notifyClassRequestSubmitted:', error);
  }
};

// Helper function to emit class request notification (to teacher)
export const notifyClassRequest = async (studentId, subjectId, studentName, className) => {
  try {
    const subject = await Subject.findById(subjectId).populate('teacher');

    if (subject && subject.teacher) {
      await createNotification({
        recipient: subject.teacher._id,
        type: 'class_request',
        title: `New Class Request from ${studentName}`,
        message: `${studentName} wants to join ${className}`,
        relatedData: {
          userId: studentId,
          subjectId: subjectId
        },
        actionUrl: `/dashboard/teacher/pending-requests`
      });
    }
  } catch (error) {
    console.error('Error in notifyClassRequest:', error);
  }
};

// Helper function to emit class request approval/rejection notification (to student)
export const notifyClassRequestUpdate = async (studentId, status, className) => {
  try {
    const statusText = status === 'approved' ? 'approved' : 'rejected';
    const titleText = status === 'approved' ? 'Request Approved! ✅' : 'Request Rejected ❌';
    
    await createNotification({
      recipient: studentId,
      type: 'class_request_update',
      title: titleText,
      message: `Your request to join ${className} has been ${statusText}`,
      relatedData: {
        subjectId: null
      },
      actionUrl: `/dashboard/student/class-request`
    });
  } catch (error) {
    console.error('Error in notifyClassRequestUpdate:', error);
  }
};

// Helper function to emit result upload notification
export const notifyResultUploaded = async (studentId, resultTitle, studentName = null) => {
  try {
    await createNotification({
      recipient: studentId,
      type: 'result_uploaded',
      title: `New Result: ${resultTitle}`,
      message: `Your result for ${resultTitle} has been uploaded`,
      actionUrl: `/dashboard/student/view-results`
    });
  } catch (error) {
    console.error('Error in notifyResultUploaded:', error);
  }
};

// Notify admin about result upload
export const notifyAdminResultUploaded = async (adminId, resultTitle, teacherName) => {
  try {
    await createNotification({
      recipient: adminId,
      type: 'result_uploaded',
      title: `Result Uploaded by ${teacherName}`,
      message: `${teacherName} uploaded results for ${resultTitle}`,
      actionUrl: `/dashboard/admin/users`
    });
  } catch (error) {
    console.error('Error in notifyAdminResultUploaded:', error);
  }
};

// Helper function to emit attendance notification
// Helper function to emit attendance notification
export const notifyAttendanceMarked = async (subjectId, className, teacherName) => {
  try {
    const subject = await Subject.findById(subjectId).populate('students');

    // Notify all students in the class
    if (subject && subject.students) {
      for (const student of subject.students) {
        await createNotification({
          recipient: student._id,
          type: 'attendance_marked',
          title: `Attendance Marked in ${className}`,
          message: `Your attendance for ${className} has been marked`,
          actionUrl: `/dashboard/student/view-attendance`
        });
      }
    }
  } catch (error) {
    console.error('Error in notifyAttendanceMarked:', error);
  }
};

// Notify admin about attendance
export const notifyAdminAttendanceMarked = async (adminId, className, teacherName) => {
  try {
    await createNotification({
      recipient: adminId,
      type: 'attendance_marked',
      title: `Attendance Marked - ${className}`,
      message: `${teacherName} marked attendance for ${className}`,
      actionUrl: `/dashboard/admin/users`
    });
  } catch (error) {
    console.error('Error in notifyAdminAttendanceMarked:', error);
  }
};

// Helper function to emit new class notification
export const notifyClassCreated = async (adminId, className, teacherName) => {
  try {
    await createNotification({
      recipient: adminId,
      type: 'class_created',
      title: `New Class Created by ${teacherName}`,
      message: `${teacherName} created a new class: ${className}`,
      actionUrl: `/dashboard/admin/subjects`
    });
  } catch (error) {
    console.error('Error in notifyClassCreated:', error);
  }
};

// Helper function to emit announcement notification
export const notifyAnnouncement = async (teacherIds, studentIds, announcementTitle) => {
  try {
    const allRecipients = [...teacherIds, ...studentIds];
    
    for (const recipientId of allRecipients) {
      await createNotification({
        recipient: recipientId,
        type: 'announcement_new',
        title: `New Announcement: ${announcementTitle}`,
        message: `A new announcement has been posted: ${announcementTitle}`,
        actionUrl: `/dashboard/student/announcements`
      });
    }
  } catch (error) {
    console.error('Error in notifyAnnouncement:', error);
  }
};
