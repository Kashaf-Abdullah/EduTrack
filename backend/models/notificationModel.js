import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema({
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: [
      'class_request',        // Student joins class - teacher notification
      'class_request_update', // Class request approved/rejected - student notification
      'result_uploaded',      // Teacher uploads result - student & admin notification
      'attendance_marked',    // Teacher marks attendance - admin & teacher notification
      'class_created',        // Teacher creates class - admin notification
      'announcement_new'      // New announcement - teacher & student notification
    ],
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  relatedData: {
    userId: mongoose.Schema.Types.ObjectId,        // Related user
    subjectId: mongoose.Schema.Types.ObjectId,     // Related subject/class
    classRequestId: mongoose.Schema.Types.ObjectId, // Related class request
    resultId: mongoose.Schema.Types.ObjectId,      // Related result
    attendanceId: mongoose.Schema.Types.ObjectId,  // Related attendance
    announcementId: mongoose.Schema.Types.ObjectId // Related announcement
  },
  actionUrl: { 
    type: String  // URL to navigate to when clicked
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Index for faster queries
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
