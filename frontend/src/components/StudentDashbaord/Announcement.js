import React, { useEffect, useState, useContext } from 'react';
import { getAnnouncements } from '../api/announcementApi';

const Announcement = () => {
      const [announcements, setAnnouncements] = useState([]);
    useEffect(()=>{
        const fetchAnnouncements = async () => {
            const data = await getAnnouncements();
            console.log(data);
            setAnnouncements(data);
          };
          fetchAnnouncements();
        })
  return (
    <div>
      <h1>Annoucnement</h1>
       <h3>Existing Announcements</h3>
      <ul>
        {announcements.map((announcement) => (
          <li key={announcement._id}>
          {new Date(announcement.dateAnnounced).toLocaleDateString()}
            {announcement.title} ({announcement.type}) - Featured user: {announcement.featuredUser?.name || announcement.featuredUser}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Announcement
