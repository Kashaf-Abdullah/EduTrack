# EduTrack Notification System Documentation

## Overview
The notification system is a comprehensive real-time notification feature that alerts users about important events across the platform. Notifications are created for various actions and displayed in a dropdown menu with a badge counter.

## Features
- ✅ Real-time notifications for all user actions
- ✅ Notification badge with unread count
- ✅ Mark notifications as read/unread
- ✅ Delete individual notifications
- ✅ Mark all as read functionality
- ✅ Auto-refresh every 30 seconds
- ✅ Responsive design
- ✅ Role-based notifications (Admin, Teacher, Student)

## Notification Types

### 1. **Class Request** (Teacher Receives)
- **Trigger**: When a student submits a class/subject join request
- **Action URL**: `/dashboard/teacher/pending-requests`
- **Recipients**: Teacher of the subject
- **Message Format**: `{StudentName} wants to join {ClassName}`

### 2. **Class Request Update** (Student Receives)
- **Trigger**: When teacher approves or rejects a class request
- **Action URL**: `/dashboard/student/class-request`
- **Recipients**: Student who made the request
- **Message Format**: 
  - Approved: `Your request to join {ClassName} has been approved`
  - Rejected: `Your request to join {ClassName} has been rejected`

### 3. **Result Uploaded** (Student & Admin Receive)
- **Trigger**: When teacher uploads/updates student results
- **Action URL**: `/dashboard/student/view-results`
- **Recipients**: Student and all Admins
- **Message Format**: `Your result for {SubjectName} has been uploaded`

### 4. **Attendance Marked** (Student & Admin Receive)
- **Trigger**: When teacher marks attendance for a class session
- **Action URL**: `/dashboard/student/view-attendance`
- **Recipients**: All students in the class and all Admins
- **Message Format**: `Your attendance for {ClassName} has been marked`

### 5. **Class Created** (Admin Receives)
- **Trigger**: When teacher creates a new class/subject
- **Action URL**: `/dashboard/admin/subjects`
- **Recipients**: All Admins
- **Message Format**: `{TeacherName} created a new class: {ClassName}`

### 6. **Announcement Posted** (Teachers & Students Receive)
- **Trigger**: When admin creates a new announcement
- **Action URL**: `/dashboard/student/announcements`
- **Recipients**: All teachers and students
- **Message Format**: `A new announcement has been posted: {AnnouncementTitle}`

## Backend API Endpoints

### Get User Notifications
```
GET /api/notifications/user/:userId
Headers: Authorization: Bearer {token}
Query Parameters:
  - unreadOnly: boolean (default: false) - Only unread notifications
  - limit: number (default: 20) - Number of notifications to fetch
  - skip: number (default: 0) - For pagination

Response:
{
  notifications: [{
    _id: string,
    recipient: string,
    type: string,
    title: string,
    message: string,
    actionUrl: string,
    isRead: boolean,
    createdAt: date
  }],
  totalCount: number,
  unreadCount: number
}
```

### Mark Notification as Read
```
PATCH /api/notifications/:notificationId/read
Headers: Authorization: Bearer {token}

Response: Updated notification object
```

### Mark All Notifications as Read
```
PATCH /api/notifications/user/:userId/read-all
Headers: Authorization: Bearer {token}

Response: { message: "All notifications marked as read" }
```

### Delete Notification
```
DELETE /api/notifications/:notificationId
Headers: Authorization: Bearer {token}

Response: { message: "Notification deleted" }
```

## Frontend Components

### NotificationContext (contexts/NotificationContext.js)
Manages notification state globally using React Context API.

**Available Methods:**
- `fetchNotifications()` - Fetch all notifications
- `markAsRead(notificationId)` - Mark single notification as read
- `markAllAsRead()` - Mark all notifications as read
- `deleteNotification(notificationId)` - Delete a notification

**Available State:**
- `notifications` - Array of all notifications
- `unreadCount` - Count of unread notifications
- `loading` - Loading state

### NotificationDropdown Component (components/Notifications/NotificationDropdown.js)
Displays the notification bell icon with badge and dropdown panel.

**Features:**
- Notification bell with unread count badge
- Animated dropdown panel
- Notification list with timestamps
- Click to read and navigate
- Delete individual notifications
- "Mark all as read" button
- Empty state message

## Installation & Setup

### 1. Backend Setup (Already Done)
Files created/updated:
- `backend/models/notificationModel.js` - Notification schema
- `backend/controllers/notificationController.js` - Notification logic
- `backend/routes/notificationRoutes.js` - API endpoints
- Updated existing controllers to emit notifications

### 2. Frontend Setup (Already Done)
Files created:
- `frontend/src/contexts/NotificationContext.js` - Context provider
- `frontend/src/components/Notifications/NotificationDropdown.js` - Dropdown UI
- `frontend/src/components/Notifications/NotificationDropdown.css` - Styles

Files updated:
- `frontend/src/App.js` - Added NotificationProvider wrapper
- `frontend/src/components/Layout/Navbar.js` - Added NotificationDropdown

## Usage

### For Developers
1. **Import the hook in any component:**
```javascript
import { useNotifications } from '../contexts/NotificationContext';

function MyComponent() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  
  // Use the values
}
```

### For Testing

#### Test as Student:
1. Login as: `ali.hassan@student.com` / `student123`
2. Go to "Class Request" → Request to join a subject
3. Notification appears for the teacher

#### Test as Teacher:
1. Login as: `ahmed.khan@edutrack.com` / `teacher123`
2. Check notification bell for pending class requests
3. Click "Pending Requests" to see and approve/reject
4. Notifications sent to students upon action

#### Test as Admin:
1. Login as: `admin@edutrack.com` / `admin123`
2. Create announcement → All users get notified
3. View notifications for all teacher/student actions

## Database Schema

```javascript
{
  _id: ObjectId,
  recipient: ObjectId (ref: User),
  type: String (enum: ['class_request', 'class_request_update', 'result_uploaded', 
                       'attendance_marked', 'class_created', 'announcement_new']),
  title: String,
  message: String,
  relatedData: {
    userId: ObjectId,
    subjectId: ObjectId,
    classRequestId: ObjectId,
    resultId: ObjectId,
    attendanceId: ObjectId,
    announcementId: ObjectId
  },
  actionUrl: String,
  isRead: Boolean,
  createdAt: Date
}
```

## Auto-Refresh Behavior
- Notifications automatically refresh every 30 seconds
- Manual refresh available via fetchNotifications()
- Runs only when user is logged in

## UI/UX Features
- Smooth animations (slide-down, pulse)
- Color-coded notification types
- Emoji icons for quick recognition
- Responsive design (works on mobile)
- Click outside to close dropdown
- Mark as read on click
- Real-time badge counter

## Performance Considerations
- Indexed queries on `recipient` and `isRead`
- Pagination support (limit & skip)
- Auto-cleanup of old notifications (optional - can be added)
- Efficient real-time updates without WebSockets

## Future Enhancements
- WebSocket integration for instant notifications
- Notification preferences/settings
- Email notifications
- SMS notifications
- Do Not Disturb schedule
- Notification archiving
- Custom notification sounds
- Desktop notifications

## Troubleshooting

### Notifications not appearing
1. Check if NotificationProvider wraps the app
2. Verify user is logged in
3. Check browser console for errors
4. Ensure API_BASE_URL is correct

### Notifications not auto-refreshing
1. Check interval is set to 30 seconds
2. Verify token is still valid
3. Check network tab for API calls

### Dropdown not closing
1. Click outside the dropdown
2. Navigate to another page
3. Check for event propagation issues

## Testing Checklist
- [ ] Notification bell shows correct unread count
- [ ] Clicking notification marks it as read
- [ ] Notifications are deleted successfully
- [ ] "Mark all as read" works
- [ ] Notifications navigate to correct page
- [ ] Auto-refresh works every 30 seconds
- [ ] Responsive on mobile devices
- [ ] Animations are smooth
- [ ] No console errors
- [ ] All notification types trigger correctly
