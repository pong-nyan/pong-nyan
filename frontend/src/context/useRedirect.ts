import { NextRouter, useRouter } from 'next/router';
import { useEffect } from 'react';

const useRedirect = (url: string | null) => {
  const router: NextRouter = useRouter();
  
  useEffect(() => {
    if (url) 
      router.push(url);
  }, [url]);
};
  
export default useRedirect;