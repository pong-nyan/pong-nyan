import { useRouter } from 'next/router';
import ChatRoom from '@/chat/components/ChatRoom';
import useAuth from '@/context/useAuth';

const ChannelChatPage = () => {
  useAuth();

  const router = useRouter();
  const { channelId } = router.query;

  return (
    <div className="commonLayout">
      <ChatRoom channelId={channelId as string} onLeaveChannel={() => router.push('/chat/list')} />
    </div>
  );
};

export default ChannelChatPage;
