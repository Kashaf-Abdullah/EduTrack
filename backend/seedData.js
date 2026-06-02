import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import Subject from './models/subjectModel.js';
import Attendance from './models/attendanceModel.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ Connection Error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    console.log('🗑️  Deleting old data...');
    await User.deleteMany({});
    await Subject.deleteMany({});
    await Attendance.deleteMany({});
    console.log('✅ Old data deleted');

    // Create Admin
    console.log('👨‍💼 Creating Admin...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      name: 'Admin User',
      email: 'admin@edutrack.com',
      password: adminPassword,
      role: 'admin',
      approved: true,
    });
    await admin.save();
    console.log('✅ Admin Created - Email: admin@edutrack.com, Password: admin123');

    // Create Teachers
    console.log('👨‍🏫 Creating Teachers...');
    const teachers = [];
    const teacherData = [
      { name: 'Mr. Ahmed Khan', email: 'ahmed.khan@edutrack.com', password: 'teacher123' },
      { name: 'Ms. Fatima Ali', email: 'fatima.ali@edutrack.com', password: 'teacher123' },
      { name: 'Dr. Hassan Malik', email: 'hassan.malik@edutrack.com', password: 'teacher123' },
    ];

    for (const data of teacherData) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const teacher = new User({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: 'teacher',
        approved: true,
      });
      await teacher.save();
      teachers.push(teacher);
      console.log(`✅ Teacher Created - Email: ${data.email}, Password: teacher123`);
    }

    // Create Students
    console.log('👨‍🎓 Creating Students...');
    const students = [];
    const studentData = [
      { name: 'Ali Hassan', email: 'ali.hassan@student.com', password: 'student123' },
      { name: 'Sara Khan', email: 'sara.khan@student.com', password: 'student123' },
      { name: 'Usman Ahmed', email: 'usman.ahmed@student.com', password: 'student123' },
      { name: 'Zainab Fatima', email: 'zainab.fatima@student.com', password: 'student123' },
      { name: 'Muhammad Tariq', email: 'tariq.muhammad@student.com', password: 'student123' },
    ];

    for (const data of studentData) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const student = new User({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: 'student',
        approved: true,
      });
      await student.save();
      students.push(student);
      console.log(`✅ Student Created - Email: ${data.email}, Password: student123`);
    }

    // Create Subjects
    console.log('📚 Creating Subjects...');
    const subjects = [];
    const subjectData = [
      {
        name: 'Mathematics',
        description: 'Advanced Mathematics including Calculus and Algebra',
        teacher: teachers[0]._id,
        classCode: 'MATH-101',
        classTimings: [
          { day: 'Monday', startTime: '09:00 AM', endTime: '10:30 AM' },
          { day: 'Wednesday', startTime: '09:00 AM', endTime: '10:30 AM' },
          { day: 'Friday', startTime: '09:00 AM', endTime: '10:30 AM' },
        ],
        courseContent: 'Calculus, Algebra, Trigonometry, Statistics',
      },
      {
        name: 'Physics',
        description: 'Introduction to Physics - Mechanics and Thermodynamics',
        teacher: teachers[1]._id,
        classCode: 'PHY-102',
        classTimings: [
          { day: 'Tuesday', startTime: '10:00 AM', endTime: '11:30 AM' },
          { day: 'Thursday', startTime: '10:00 AM', endTime: '11:30 AM' },
        ],
        courseContent: 'Mechanics, Thermodynamics, Waves, Electricity',
      },
      {
        name: 'Chemistry',
        description: 'Organic and Inorganic Chemistry',
        teacher: teachers[2]._id,
        classCode: 'CHEM-103',
        classTimings: [
          { day: 'Monday', startTime: '02:00 PM', endTime: '03:30 PM' },
          { day: 'Wednesday', startTime: '02:00 PM', endTime: '03:30 PM' },
        ],
        courseContent: 'Organic Chemistry, Inorganic Chemistry, Biochemistry',
      },
    ];

    for (const data of subjectData) {
      const subject = new Subject({
        name: data.name,
        description: data.description,
        teacher: data.teacher,
        students: students.map((s) => s._id), // Enroll all students
        classCode: data.classCode,
        classTimings: data.classTimings,
        courseContent: data.courseContent,
      });
      await subject.save();
      subjects.push(subject);
      
      // Also enroll students in subjects
      for (const student of students) {
        await User.updateOne(
          { _id: student._id },
          { $addToSet: { enrolledSubjects: subject._id } }
        );
      }
      
      console.log(`✅ Subject Created - ${data.name} (${data.classCode})`);
    }

    // Create Attendance Records
    console.log('📝 Creating Attendance Records...');
    
    for (const subject of subjects) {
      // Create attendance for last 5 days
      for (let i = 0; i < 5; i++) {
        const classDate = new Date();
        classDate.setDate(classDate.getDate() - i);
        classDate.setHours(9, 0, 0, 0);

        const attendanceRecords = students.map((student) => ({
          student: student._id,
          signInTime: new Date(classDate.getTime() + Math.random() * 600000), // Random time within 10 mins
          signOutTime: new Date(classDate.getTime() + 90 * 60 * 1000 + Math.random() * 600000), // Class duration + 10 mins
          present: Math.random() > 0.1, // 90% presence rate
        }));

        const attendance = new Attendance({
          subject: subject._id,
          classDate,
          classCode: subject.classCode,
          attendanceRecords,
        });
        await attendance.save();
      }
      
      console.log(`✅ Attendance Created - 5 sessions for ${subject.name}`);
    }

    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ DATABASE SEEDED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('📋 TEST ACCOUNTS CREATED:');
    console.log('');
    console.log('👨‍💼 ADMIN:');
    console.log('   Email: admin@edutrack.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('👨‍🏫 TEACHERS:');
    for (const data of teacherData) {
      console.log(`   Email: ${data.email}, Password: teacher123`);
    }
    console.log('');
    console.log('👨‍🎓 STUDENTS:');
    for (const data of studentData) {
      console.log(`   Email: ${data.email}, Password: student123`);
    }
    console.log('');
    console.log('📚 SUBJECTS: Mathematics, Physics, Chemistry');
    console.log('');
    console.log('═══════════════════════════════════════════════════════');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error.message);
    process.exit(1);
  }
};

// Run the seed
(async () => {
  await connectDB();
  await seedData();
})();
