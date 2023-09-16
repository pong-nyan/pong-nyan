import React, { useState, useEffect, useContext } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import SendMessageButton from './SendMessageButton';
import { SocketContext } from '@/context/socket';
import { getMessagesFromLocalStorage } from '../utils/chatLocalStorage';
import { Message } from '@/type/chatType';
import { Channel } from '@/type/chatType';
import { IntraId } from '@/type/userType';
import { sha256 } from 'js-sha256';
import useAuth from '@/context/useAuth';

function ChatRoom({ channelId, onLeaveChannel } : { channelId: string, onLeaveChannel: () => void }) {
  useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [channel, setChannel] = useState<Channel | null>(null);
  const { chatNamespace } = useContext(SocketContext);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
      const newMessage : Message = {
        content: inputMessage,
        nickname: loggedInUser.nickname
      };
      chatNamespace.emit('chat-message-in-channel', { channelId, message: newMessage, sender: loggedInUser.intraId });
      setInputMessage('');
    }
  };

  const handleLeaveChannel = () => {
    chatNamespace.emit('chat-leave-channel', channelId);
    onLeaveChannel();
  };

  const makeAdministrator = (grantedUser: IntraId) => {
    chatNamespace.emit('chat-grant-administrator', { channelId, user: grantedUser });
  };

  const deleteAdministrator = (deletedUser: IntraId) => {
    chatNamespace.emit('chat-delete-administrator', { channelId, user: deletedUser });
  };

  const handleChangePassword = () => {
    const newPassword = prompt('새로운 비밀번호를 입력하세요.');
    if (!newPassword) return;
    const passwordPattern = /^[a-zA-Z0-9]{4,8}$/;
    if (!passwordPattern.test(newPassword)) {
      alert('비밀번호는 4글자 이상 8글자 이하의 알파벳과 숫자만 포함해야 합니다.');
      return;
    }
    const hasedInputPassword = sha256(newPassword);
    chatNamespace.emit('chat-change-password', { channelId, password : hasedInputPassword });
  };

  const handleRemovePassword = () => {
    const confirmRemove = window.confirm('정말로 비밀번호를 제거하시겠습니까?');
    if (confirmRemove) {
      chatNamespace.emit('chat-remove-password', { channelId });
    }
  };

  const kickUser = (targetUser: IntraId) => {
    chatNamespace.emit('chat-kick-user', { channelId, user: targetUser });
  };

  const banUser = (targetUser: IntraId) => {
    chatNamespace.emit('chat-ban-user', { channelId, user: targetUser });
  };

  const muteUser = (targetUser: IntraId) => {
    chatNamespace.emit('chat-mute-user', { channelId, user: targetUser });
  };

  // const findNicknameById = (id: IntraId): string => {
  //   const user = channel?.userList.find(user => user.intraId === id);
  //   return user ? user.nickname : id;  // 만약 찾지 못하면 id를 반환
  // };

  const findNicknameById = (id: IntraId | undefined): string => {
    if (!id) return ''; // id가 undefined나 null일 경우 빈 문자열 반환
    const user = channel?.userList.find(user => user.intraId === id);
    return user ? user.nickname : '';
  };

  useEffect(() => {
    console.log('[Chat] 처음 접속시 localStorage에서 메시지 불러옴');
    const loadedMessages = getMessagesFromLocalStorage(channelId as string);
    setMessages(loadedMessages);
  }, [chatNamespace, channelId]);

  useEffect(() => {
    console.log('[Chat] 처음 접속했을때 채널 정보를 서버에 요청함');
    if (channelId) {
      console.log('[Chat] 처음 접속했을때 channelId 존재함');
      chatNamespace.emit('chat-request-channel-info', { channelId });
    }
  }, [chatNamespace, channelId]);

  useEffect(() => {
    console.log('[Chat] 채널 정보를 서버에 다시 요청함');
    chatNamespace.on('chat-response-channel-info', (response) => {
      if (response.error) {
        alert(response.error);
      } else {
        setChannel(response.channel);
      }
    });
    if (channelId) {
      chatNamespace.emit('chat-request-channel-info', { channelId });
    }
    return () => {
      chatNamespace.off('chat-response-channel-info');
    };
  }, [chatNamespace, channelId]);

  useEffect(() => {
    chatNamespace.on('chat-watch-new-message', (data)=>{
      console.log('[Chat] chat-watch-new-message', data);
      const { channelId: receivedChannelId } = data;
      const storageMessages = getMessagesFromLocalStorage(receivedChannelId);
      setMessages(storageMessages);
    });

    return () => {
      chatNamespace.off('chat-watch-new-message');
    };
  }, [chatNamespace, channelId]);

  useEffect(() => {
    // emit에 성공한 후 채널정보를 화면에 동기화 시키고 메시지를 alert로 출력합니다.
    chatNamespace.on('chat-finish-message', (finishMessage) => {
      alert(finishMessage);
      chatNamespace.emit('chat-request-channel-info', { channelId });
    });
    // emit에 실패한 후 에러메시지를 alert로 출력합니다.
    chatNamespace.on('chat-catch-error-message', (errorMessage) => {
      alert(errorMessage);
    });

    return () => {
      chatNamespace.off('chat-finish-message');
      chatNamespace.off('chat-catch-error-message');
    };
  }, [chatNamespace]);

  useEffect(() => {
    chatNamespace.on('chat-kicked-from-channel', (receivedChannelId) => {
      chatNamespace.emit('chat-leave-channel', receivedChannelId);
      onLeaveChannel();
      alert('강퇴 당했습니다.');
    });

    // 밴은 banList에 추가되는 것만 다름
    chatNamespace.on('chat-baned-from-channel', (receivedChannelId) => {
      chatNamespace.emit('chat-leave-channel', receivedChannelId);
      onLeaveChannel();
      alert('밴 당했습니다.');
    });

    chatNamespace.on('chat-muted-from-channel', () => {
      alert('20초 음소거 당했습니다.');
    });

    //채널이 사라졌을 때 나머지 유저 내보내기
    chatNamespace.on('chat-channel-deleted', (receivedChannelId) => {
      chatNamespace.emit('chat-leave-channel', receivedChannelId);
      onLeaveChannel();
      alert('채널이 삭제되었습니다.');
    });

    return () => {
      chatNamespace.off('chat-kicked-from-channel');
      chatNamespace.off('chat-baned-from-channel');
      chatNamespace.off('chat-muted-from-channel');
      chatNamespace.off('chat-channel-deleted');
    };
  }, [chatNamespace]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', height: '100%', maxWidth: '700px', minWidth: '370px', backgroundColor: 'ivory' }}>
        <div style={{ display: 'flex', padding: '10px', borderBottom: '1px solid gray', justifyContent: 'space-between'}}>
          <strong>Current Channel:</strong> {channel?.title ? channel.title : 'No Channel Selected'}
          <button onClick={handleLeaveChannel}>Leave Channel</button>
          {/* 비밀번호 변경/제거 버튼 추가 - owner만 볼 수 있도록 */}
          {channel?.channelType === 'protected' && channel?.owner === JSON.parse(localStorage.getItem('user') || '{}').intraId && (
            <>
              <button onClick={handleChangePassword}>비밀번호 변경</button>
              <button onClick={handleRemovePassword}>비밀번호 제거</button>
            </>
          )}
          <button onClick={() => {history.back();}}>뒤로가기</button>
        </div>
        <div style={{ padding: '10px', borderBottom: '1px solid gray' }}>
          <h3>Channel Members</h3>
          <strong>Owner:</strong>
          <ul style={{ listStyleType: 'none' }}>
            <li>{findNicknameById(channel?.owner)}</li>
          </ul>
          <strong>Invited Users:</strong>
          <ul style={{ listStyleType: 'none' }}>
            {channel?.invitedUsers.map(invitedUser => (
              <li key={invitedUser}>
                {findNicknameById(invitedUser)}
              </li>
            ))}
          </ul>

          <strong>Administrators:</strong>
          <ul style={{ listStyleType: 'none' }}>
            {channel?.administrator.map(admin => (
              <li key={admin}>
                {findNicknameById(admin)}
                {channel?.owner === JSON.parse(localStorage.getItem('user') || '{}').intraId && (
                  <button onClick={() => deleteAdministrator(admin)}>Delete Administrator</button>
                )}
              </li>
            ))}
          </ul>
          <strong>Users:</strong>
          <ul style={{ listStyleType: 'none' }}>
            {channel?.userList.map(user => (
              <li key={user.intraId}>
                {user.nickname}
                {(channel?.owner === JSON.parse(localStorage.getItem('user') || '{}').intraId || channel?.administrator.includes(JSON.parse(localStorage.getItem('user') || '{}').intraId)) && (
                  <>
                    <button onClick={() => kickUser(user.intraId)}>Kick</button>
                    <button onClick={() => banUser(user.intraId)}>Ban</button>
                    <button onClick={() => muteUser(user.intraId)}>Mute</button>
                  </>
                )}
                {channel?.owner === JSON.parse(localStorage.getItem('user') || '{}').intraId && (
                  <button onClick={() => makeAdministrator(user.intraId)}>Make Administrator</button>
                )}
              </li>
            ))}
          </ul>
          <strong>Invited Users:</strong>
          <ul style={{ listStyleType: 'none' }}>
            {channel?.invitedUsers.map(invitedUser => (
              <li key={invitedUser}>
                {findNicknameById(invitedUser)}
              </li>
            ))}
          </ul>
        </div>
        <MessageList messages={messages} />
        <div style={{ display: 'flex', marginTop: 'auto', justifyContent: 'space-between' }}>
          <MessageInput value={inputMessage} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)} onSubmit={handleSendMessage}/>
          <SendMessageButton onClick={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
