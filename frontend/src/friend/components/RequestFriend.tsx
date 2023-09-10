import { useState } from 'react';

const RequestFriend = () => {
  const [nickname, setNickname] = useState('');
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nickname) {
      alert('친구요청할 친구의 nickname을 입력해주세요.');
      return;
    }
    // TODO: request friend using axios
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>친구요청할 친구의 nickname</label>
        <input
          type='text'
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <button type='submit'>친구요청</button>
      </form>
    </>
  );
};

export default RequestFriend;