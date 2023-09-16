import styles from '@/friend/styles/RequestFriend.module.css';
import { useState } from 'react';
import axios from 'axios';

const RequestFriend = () => {
  const [nickname, setNickname] = useState('');
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nickname) {
      alert('친구요청할 친구의 nickname을 입력해주세요.');
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
      alert('친구요청을 성공했습니다.');
      setNickname('');
    }).
      catch((error) => {
        if (error.response.status === 401) {
          alert('로그인이 필요합니다.');
          localStorage.removeItem('user');
          location.replace('/auth');
          return ;
        }
        alert(`${error.response.data.message} 를 이유로 친구요청을 실패했습니다.`);
      });
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>친구요청할 친구의 nickname</label>
        <input
          className={styles.input}
          type='text'
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <button className={styles.button} type='submit'>
          친구요청
        </button>
      </form>
    </>
  );
};

export default RequestFriend;