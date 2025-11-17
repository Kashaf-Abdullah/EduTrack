import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import resultRoutes from './routes/resultRoutes.js'
import attendanceRoutes from './routes/attendanceRoutes.js';
import publicInfoRoutes from './routes/publicInfoRoutes.js'
import announcementsRoutes from './routes/announcementRoutes.js'
import classRequestRoutes from './routes/classRequestRoutes.js'

dotenv.config();

connectDB();

const app = express();
app.use(cors()); 
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/public-info', publicInfoRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/class-requests', classRequestRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
