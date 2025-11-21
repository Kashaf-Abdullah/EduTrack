import React, { useEffect, useState, useContext } from 'react';
import { getPublicInfo } from '../api/publicInfoApi';


const PublicInfo = () => {
    const [publicInfos, setPublicInfos] = useState([]);
    useEffect(()=>{
        const fetchPublicInfos = async () => {
            const data = await getPublicInfo();
        setPublicInfos(data);
        }
        fetchPublicInfos();
        })
  return (
    <div>
      <ul>
        {
            publicInfos.map((info) => (
        

    <li key={info._id}>
    {info.title} - {info.content}
    </li>
            ))
        }
      </ul>
    </div>
  )
}

export default PublicInfo
