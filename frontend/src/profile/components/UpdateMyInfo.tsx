import encodeFileToBase64 from '@/auth/logic/encodeFileToBase65';
import styles from '@/profile/styles/updateMyInfo.module.css';
import { useState } from 'react';
import axios from 'axios';

const UpDateMyInfo = () => {
  const [nickname, setNickname] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [google2faOption, setGoogle2faOption] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/profile/update`, {
      nickname,
      avatar,
      email: email || 'you_must_input_email@mail.com',
      google2faOption,
    }).then(() => {
      alert('수정 성공');
      setNickname('');
      setAvatar('');
      setEmail('');
      setGoogle2faOption(false);
      localStorage.removeItem('user');
      location.href = '/';
    }).catch((err) => {
      if (err?.response?.status === 401) {
        alert('로그인이 필요합니다.');
        localStorage.removeItem('user');
        location.replace('/auth');
        return;
      }
      console.error(err);
      alert(err?.response?.data?.message || '서버와 통신에 실패했습니다.');
    });
  };  

  return (
    <div className={styles.updateContainer}>
      <h1 className={styles.updateTitle} >Update My Info</h1>
      <form onSubmit={handleSubmit}>
        <label className={styles.updateLabel} htmlFor="nickname">Nickname</label>
        <input
          type="text"
          className={styles.updateInput}
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        /> 
        <label className={styles.updateLabel} htmlFor="image">Image</label>
        <input
          type="file"
          className={styles.updateInput}
          id="image"
          accept='image/*'
          onChange={async(e) => {
            if (!e.target.files) {
              setAvatar('');
              return;
            }
            const file = e.target.files[0];
            if (!file) {
              setAvatar('');
              return;
            }
            const image = await encodeFileToBase64(file);
            setAvatar(image);
          }}
          onClick={(e) => e.currentTarget.value = ''}
        />
        <label className={styles.updateLabel} htmlFor="email">Email</label>
        <input
          type="email"
          className={styles.updateInput}
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className={styles.updateLabel} htmlFor="google2faOption">Google 2FA</label>
        <input
          type="checkbox"
          className={styles.updateInput}
          id="google2faOption"
          checked={google2faOption}
          onChange={(e) => setGoogle2faOption(e.target.checked)}
        />
        <button type="submit" className={styles.updateButton}>Update</button>
      </form>
    </div>
  );
};

export default UpDateMyInfo;