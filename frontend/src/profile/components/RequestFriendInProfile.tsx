import axios from 'axios';

const RequestFriendInProfile = ({ nickname }: { nickname: string }) => {
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!nickname) {
      alert('nickname이 정상적이지 않습니다.');
      return;
    }
    if (nickname === JSON.parse(localStorage.getItem('user') || '{}').nickname) {
      alert('자기 자신에게 친구요청을 할 수 없습니다.');
      return;
    }
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/friends/request`,
      {
        friendNickname: nickname
      }).then(() => {
      alert(`${nickname}에게 친구요청을 성공했습니다.`);
    }).
      catch((error) => {
        alert(`${error.response.data.message} 를 이유로 친구요청을 실패했습니다.`);
      }
      );
  };

  return (
    <>
      <button onClick={handleSubmit}>친구요청</button>
    </>
  );
};

export default RequestFriendInProfile;