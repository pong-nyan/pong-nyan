import { useRouter } from 'next/router';
import { useEffect } from 'react';
import axios from 'axios';

const usePostRedirect = (url: string, method: 'get' | 'post') => {
  const router = useRouter();
  
  useEffect(() => {
    const fetchAndRedirect = async () => {
      if (url) {
        try {
          let res;
          switch (method) {
          case 'get':
            res = await axios.get(url, { withCredentials: true });
            break;
          case 'post':
            res = await axios.post(url, { withCredentials: true });
            break;
          }
          if (res.status === 200 && res.data.redirectUrl) {
            router.push(res.data.redirectUrl);
          }
        } catch (error) {
          console.error('Redirect error:', error);
        }
      }
    };
  
    fetchAndRedirect();
  }, [url, router]);
};
  
export default usePostRedirect;