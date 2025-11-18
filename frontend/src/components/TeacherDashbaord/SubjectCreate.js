// import React, { useState, useContext } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../../contexts/AuthContext';

// const SubjectCreate = () => {
//   const { token } = useContext(AuthContext);

//   const [form, setForm] = useState({
//     name: '',
//     description: '',
//     classTimings: '',
//     courseContent: '',
//   });

//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     try {
//       const res = await axios.post('http://localhost:5000/api/subjects', form, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSuccess(`Subject "${res.data.name}" created successfully!`);
//       setForm({
//         name: '',
//         description: '',
//         classTimings: '',
//         courseContent: '',
//       });
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to create subject');
//     }
//   };

//   return (
//     <div>
//       <h2>Create New Subject</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {success && <p style={{ color: 'green' }}>{success}</p>}
//       <form onSubmit={handleSubmit}>
//         <label>
//           Name:<br />
//           <input
//             type="text"
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             required
//           />
//         </label>
//         <br />
//         <label>
//           Description:<br />
//           <textarea
//             name="description"
//             value={form.description}
//             onChange={handleChange}
//             rows="3"
//           />
//         </label>
//         <br />
//         <label>
//           Class Timings:<br />
//           <input
//             type="text"
//             name="classTimings"
//             value={form.classTimings}
//             onChange={handleChange}
//             placeholder="e.g. Mon-Wed-Fri 10:00-11:00"
//           />
//         </label>
//         <br />
//         <label>
//           Course Content:<br />
//           <textarea
//             name="courseContent"
//             value={form.courseContent}
//             onChange={handleChange}
//             rows="4"
//           />
//         </label>
//         <br />
//         <button type="submit">Create Subject</button>
//       </form>
//     </div>
//   );
// };

// export default SubjectCreate;

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const daysOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const timeSlots = [
  "08:00 AM - 09:00 AM",
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
];

const SubjectCreate = () => {
  const { token } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: '',
    description: '',
    classTimings: [], // Array of objects {day, startTime, endTime}
    courseContent: '',
  });

  const [day, setDay] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleTimingAdd = () => {
    if (!day || !timeSlot) {
      setError("Please select both day and time slot");
      return;
    }
    const [startTime, endTime] = timeSlot.split(' - ');
    // Add to classTimings array if not duplicate
    const exists = form.classTimings.some(
      (t) => t.day === day && t.startTime === startTime && t.endTime === endTime
    );
    if (exists) {
      setError("This timing is already added");
      return;
    }
    const newTimings = [...form.classTimings, { day, startTime, endTime }];
    setForm({ ...form, classTimings: newTimings });
    setDay('');
    setTimeSlot('');
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Subject name is required");
      return;
    }
    if (form.classTimings.length === 0) {
      setError("Please add at least one class timing");
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/subjects', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(`Subject "${res.data.name}" created successfully!`);
      setForm({ name: '', description: '', classTimings: [], courseContent: '' });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create subject');
    }
  };

  return (
    <div>
      <h2>Create New Subject</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name:<br />
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </label>

        <br />

        <label>
          Description:<br />
          <textarea name="description" value={form.description} onChange={handleChange} rows="3" />
        </label>

        <br />

        <label>
          Add Class Timing:<br />
          <select value={day} onChange={(e) => setDay(e.target.value)}>
            <option value="">Select Day</option>
            {daysOptions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
            <option value="">Select Time Slot</option>
            {timeSlots.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <button type="button" onClick={handleTimingAdd}>Add Timing</button>
        </label>

        <br />

        <div>
          <strong>Current Timings:</strong>
          <ul>
            {form.classTimings.map(({ day, startTime, endTime }, idx) => (
              <li key={idx}>{day} {startTime} - {endTime}</li>
            ))}
          </ul>
        </div>

        <br />

        <label>
          Course Content:<br />
          <textarea name="courseContent" value={form.courseContent} onChange={handleChange} rows="4" />
        </label>

        <br />

        <button type="submit">Create Subject</button>
      </form>
    </div>
  );
};

export default SubjectCreate;
