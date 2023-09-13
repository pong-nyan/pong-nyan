import Friends from "@/friends/components/Friends";
import NavButtonWrapper from "@/chat/components/NavButtonWrapper";
import { useRouter } from "next/router";
import PlusButton from "@/_components/PlusButton";

const FriendsPage = () => {
  const router = useRouter();
  const { intraId } = router.query;
  if (!intraId) return <div>친구 정보를 불러오는 중입니다.</div>;
  return (
    <div>
      <Friends />
      <PlusButton alt='add friend' herf='/friend/manage' />
      <NavButtonWrapper />
    </div>
  );
};

export default FriendsPage;