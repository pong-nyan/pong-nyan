import React, { useState } from 'react';
import { usePostFetchData } from '@/context/usePostFetchData';
import useRedirect from '@/context/useRedirect';
import encodeFileToBase64 from '@/auth/logic/encodeFileToBase65';

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
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nickname">Nickname</label>
        <input
          type="text"
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <label htmlFor="image">Image</label>
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
        {avatar && <img src={avatar} alt="avatar" />}
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
  