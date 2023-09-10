import React, { useState } from 'react';
import { usePostFetchData } from '@/context/usePostFetchData';
import useRedirect from '@/context/useRedirect';
import encodeFileToBase64 from '@/auth/logic/encodeFileToBase65';
import styles from '@/auth/styles/signUp.module.css';

const SignUp = () => {
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState<string>('');
  const [email, setEmail] = useState('');
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`;

  const postFetchData = usePostFetchData(url, { nickname, avatar, email });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nickname) {
      alert('Nickname is required');
      return;
    }
    if (!email) {
      alert('Email is required');
      return;
    }

    const output = await postFetchData();
    setRedirectUrl(output);
  };

  useRedirect(redirectUrl);

  return (
    <div className={styles.signUpContainer}>
      <h1 className={styles.signUpTitle}>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label className={styles.signUpLabel} htmlFor="nickname">Nickname</label>
        <input
          type="text"
          id="nickname"
          className={styles.signUpInput}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <label className={styles.signUpLabel} htmlFor="image">Image</label>
        <input
          type="file"
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
        {avatar && <img src={avatar} alt="avatar" className={styles.signUpImage} />}
        <label className={styles.signUpLabel} htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          className={styles.signUpInput}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className={styles.signUpButton}>Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
  