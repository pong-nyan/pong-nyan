import { NextRouter } from 'next/router';

const redirect42Oauth = (router: NextRouter) => {
  const envClientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const redirect_uri = process.env.NEXT_PUBLIC_REDIRECT_URI;
  router.push(
    `https://api.intra.42.fr/oauth/authorize?client_id=${envClientId}&redirect_uri=${redirect_uri}&response_type=code`
  );
};

export default redirect42Oauth;
