import React, { useEffect, useState } from 'react';
import { Channel } from '@/type/chatType';
import axios from 'axios';
import useAuth from '@/context/useAuth';

const PublicChannelListPage = () => {
  useAuth();
  const [publicChannels, setPublicChannels] = useState<Channel[]>([]);

  const fetchChannels = () => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat/public-list`)
      .then(response => {
        setPublicChannels(response.data);
      })
      .catch(error => {
        console.error('Error fetching public channels:', error);
      });
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  return (
    <div>
      <div>
        <h1>공개방</h1>
        <button onClick={fetchChannels}>새로고침</button>
      </div>
      <div>
        <h3>공개방 목록 | 인원 | 잠금여부</h3>
        <ul>
          {publicChannels.map(channel => (
            <li key={channel.id}>
              {channel.title} | {channel.userList.length} / {channel.maxUsers}명 |
              <img
                src = {channel.channelType === 'protected' ? '/assets/lock.png' : '/assets/unlock.png'}
                alt = {channel.password ? '잠김' : '공개'}
                style = {{ width: '16px', height: '16px' }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PublicChannelListPage;
