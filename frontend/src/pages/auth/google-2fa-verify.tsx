import Google2FA from '@/auth/components/Google2FA';

const Google2FAVerify = () => {
  return (
    <>
      <h1>
        Please enter the code from your authenticator app.
      </h1>
      <p>
        ex: 123456
      </p>
      <Google2FA />
    </>
  );
};

export default Google2FAVerify;