import axios from 'axios';

export const useGetFetchDataRedirect = (url: string | null) => {
  const getFetchData = async () => {
    if (url) {
      try {
        const res = await axios.get(url, { withCredentials: true });
        return res.data.redirectUrl;
      } catch (error) {
        console.error('Fetch data error:', error);
        return null;
      }
    }
  };
  return getFetchData;
};
