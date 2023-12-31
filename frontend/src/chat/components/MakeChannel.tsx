import React, { useContext, useState } from 'react';
import { SocketContext } from '@/context/socket';
import { ChannelType } from '@/type/chatType';
import Modal from '@/chat/components/Modal';
import { sha256 } from 'js-sha256';
import useAuth from '@/context/useAuth';

// 채널 생성 컴포넌트
const MakeChannel = ({ isOpen, onClose }: { isOpen: boolean, onClose: ()=>void }) => {
  useAuth();
  const [channelTitle, setChannelTitle] = useState('');
  const [channelPassword, setChannelPassword] = useState('');
  const [maxUsers, setMaxUser] = useState('');
  const [channelType, setChannelType] = useState<ChannelType>('public');
  const { chatNamespace } = useContext(SocketContext);

  const handleCreateChannel = (onClose: () => void) => {
    let channelMaxUsers = 21;

    if (!maxUsers.trim() || !maxUsers || isNaN(Number(maxUsers))) {
      alert('최대 인원수는 숫자만 입력 가능합니다.');
      return;
    }
    channelMaxUsers = parseInt(maxUsers, 10);
    if (channelMaxUsers > 25) {
      alert('최대 인원수는 25명을 초과할 수 없습니다.');
      return;
    }
    if (channelMaxUsers < 2) {
      alert('최대 인원수는 2명 이상이어야 합니다.');
      return;
    }

    if (channelType === 'protected') {
      const passwordPattern = /^[a-zA-Z0-9]{4,8}$/;
      if (!passwordPattern.test(channelPassword)) {
        alert('비밀번호는 4글자 이상 8글자 이하의 알파벳과 숫자만 포함해야 합니다.');
        return;
      }
    }

    const channelInfo = {
      title: channelTitle,
      password: channelType === 'protected' ? sha256(channelPassword): '',
      channelType,
      maxUsers: channelMaxUsers,
    };
    console.log('handleCreateChannel', channelInfo);
    chatNamespace.emit('chat-channel-make', channelInfo);

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{backgroundColor: 'lightblue'}}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p style={{ margin: 0, marginRight: '10px' }}>방 제목 : </p>
            <input
              type="text"
              placeholder="channel제목을 입력해주세요."
              value={channelTitle}
              onChange={e => setChannelTitle(e.target.value)}
            />
          </div>
        </div>
        <div className="make-channel__input" style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '10px' }}>공개방</span>
          <input
            type="radio"
            name="channelType"
            checked={channelType === 'public'}
            onChange={() => setChannelType('public')}
          />
        </div>
        <div className="make-channel__input" style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '10px' }}>비밀번호방</span>
          <input
            type="radio"
            name="channelType"
            checked={channelType === 'protected'}
            onChange={() => setChannelType('protected')}
          />
        </div>
        <div className="make-channel__input" style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="방 최대 인원수"
            value={maxUsers}
            onChange={e => setMaxUser(e.target.value)}
          />
        </div>
        {channelType === 'protected' && (
          <div className="make-channel__input" style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="방 비밀번호를 입력해주세요"
              value={channelPassword}
              onChange={e => setChannelPassword(e.target.value)}
            />
          </div>
        )}
        <div className="make-channel__input" style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="button"
            value="채널생성"
            onClick={() => {handleCreateChannel(onClose);}}
          />
        </div>
      </div>
    </Modal>
  );
};

export default MakeChannel;