import React, { useState } from 'react';
import { socket } from '@/context/socket';


// 채널 생성 컴포넌트
const MakeChannel = () => {
  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');
  const [maxUser, setMaxUser] = useState('');
  const [privateRoom, setPrivateRoom] = useState(false);
  const [inviteOnly, setInviteOnly] = useState(false);

  const handleCreateChannel = () => {
    const channelInfo = {
      title,
      password,
      private: privateRoom,
      maxUser: parseInt(maxUser, 10),
      inviteOnly,
    };
    socket.emit('chat-channel-make', channelInfo);
  }

  return (
    <div style={{backgroundColor: 'lightblue'}}>
      <div className="make-channel" style={{ display: 'flex', alignItems: 'center' }}>
        <button>
          채널
        </button>
        <button>
          DM
        </button>
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p style={{ margin: 0, marginRight: '10px' }}>방 제목 : </p>
          <input type="text" placeholder="channel제목을 입력해주세요." value={title} onChange={e => setTitle(e.target.value)} />
        </div>
      </div>
      <div className="make-channel__input" style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '10px' }}>공개방</span>
        <input type="radio" name="channelType" checked={!privateRoom} onChange={() => setPrivateRoom(false)} />
      </div>
      <div className="make-channel__input" style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '10px' }}>비공개방</span>
        <input type="radio" name="channelType" checked={privateRoom} onChange={() => setPrivateRoom(true)} />
      </div>
      <div className="make-channel__input" style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '10px' }}>초대방</span>
        <input type="radio" name="channelType" checked={inviteOnly} onChange={e => setInviteOnly(e.target.checked)} />
      </div>
      <div className="make-channel__input" style={{ display: 'flex', alignItems: 'center' }}>
        <input type="text" placeholder="방 최대 인원수" value={maxUser} onChange={e => setMaxUser(e.target.value)} />
      </div>
      {/* TODO: 비밀번호는 공개방,비공개방을 눌렀을때 입력받기? 평소에는 hidden?? 그렇게 하는게 좋을까? */}
      <div className="make-channel__input" style={{ display: 'flex', alignItems: 'center' }}>
        <input type="text" placeholder="방 비밀번호를 입력해주세요" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <div className="make-channel__input" style={{ display: 'flex', alignItems: 'center' }}>
        <input type="button" value="채널생성" onClick={handleCreateChannel} />
      </div>
    </div>
  );
};

export default MakeChannel;