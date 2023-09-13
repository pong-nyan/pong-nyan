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

function ChatRoom({ channelId, onLeaveChannel } : { channelId: string, onLeaveChannel: () => void }) {
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
      chatNamespace.emit('chat-message-in-channel', { channelId, message: newMessage });
      setInputMessage('');
    }
  };

  const handleLeaveChannel = () => {
    chatNamespace.emit('chat-leave-channel', channelId);
    onLeaveChannel();
  };

  const makeAdministrator = (grantedUser: IntraId) => {
    // 서버에 업데이트된 목록을 보내는 로직 추가
    chatNamespace.emit('chat-grant-administrator', { channelId, user: grantedUser });
  };

  const deleteAdministrator = (deletedUser: IntraId) => {
    // 서버에 업데이트된 목록을 보내는 로직 추가
    chatNamespace.emit('chat-delete-administrator', { channelId, user: deletedUser });
  };

  const handleChangePassword = () => {
    const newPassword = prompt('새로운 비밀번호를 입력하세요.');
    if (!newPassword) return;
    const hasedInputPassword = sha256(newPassword);
    chatNamespace.emit('chat-change-password', { channelId, password : hasedInputPassword });
  };

  const handleRemovePassword = () => {
    const confirmRemove = window.confirm('정말로 비밀번호를 제거하시겠습니까?');
    if (confirmRemove) {
      chatNamespace.emit('chat-remove-password', { channelId });
    }
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

  // useEffect(() => {
  //   console.log('[Chat] 접속해있는 URL의 channelId가 바뀔때마다 채널 정보를 서버에 요청함');
  //   if (channelId) {
  //     chatNamespace.on('chat-response-channel-info', (response) => {
  //       console.log('[Chat] chat-response-channel-info 받음', response);
  //       if (response.error) {
  //         alert(response.error);
  //       } else {
  //         setChannel(response.channel);
  //       }
  //     });

  //     return () => {
  //       chatNamespace.off('chat-response-channel-info');
  //     };
  //   }
  // }, [chatNamespace, channel, channelId]);

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

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', height: '100%', maxWidth: '700px', minWidth: '370px', backgroundColor: 'ivory' }}>
        <div style={{ padding: '10px', borderBottom: '1px solid gray' }}>
          <strong>Current Channel:</strong> {channel?.title ? channel.title : 'No Channel Selected'}
          <button onClick={handleLeaveChannel}>Leave Channel</button>
          {/* 비밀번호 변경/제거 버튼 추가 - owner만 볼 수 있도록 */}
          {channel?.channelType === 'protected' && channel?.owner === JSON.parse(localStorage.getItem('user') || '{}').intraId && (
            <>
              <button onClick={handleChangePassword}>비밀번호 변경</button>
              <button onClick={handleRemovePassword}>비밀번호 제거</button>
            </>
          )}
        </div>
        <div style={{ padding: '10px', borderBottom: '1px solid gray' }}>
          <h3>Channel Members</h3>
          <strong>Owner:</strong>
          <ul>
            <li>{channel?.owner}</li>
          </ul>
          <strong>Administrators:</strong>
          <ul>
            {channel?.administrator.map(admin => (
              <li key={admin}>
                {admin}
                <button onClick={() => deleteAdministrator(admin)}>Delete Administrator</button>
              </li>
            ))}
          </ul>
          <strong>Users:</strong>
          <ul>
            {channel?.userList.map(user => (
              <li key={user}>
                {user}
                <button onClick={() => makeAdministrator(user)}>Make Administrator</button>
              </li>
            ))}
          </ul>
          <strong>Invited Users:</strong>
          <ul>
            {channel?.invitedUsers.map(invitedUser => (
              <li key={invitedUser}>{invitedUser}</li>
            ))}
          </ul>
        </div>
        <MessageList messages={messages} />
        <div style={{ display: 'flex', marginTop: 'auto' }}>
          <MessageInput value={inputMessage} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)} />
          <SendMessageButton onClick={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
