import React, { useState } from 'react';
import { usePostFetchData } from '@/context/usePostFetchData';
import useRedirect from '@/context/useRedirect';

const SignUp = () => {
  // create a form with nickname, image, email
  // with react, and use onChange to set the state
  // and onSubmit to send the data to the backend
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');
  const [email, setEmail] = useState('');
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`;

  const postFetchData = usePostFetchData(url, { nickname, avatar, email });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
          type="text"
          id="image"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
        />
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
  