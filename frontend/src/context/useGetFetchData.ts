import axios from 'axios';

export const useFetchData = (url: string) => {
  const getFetchData = async () => {
    try {
      const res = await axios.get(url, { withCredentials: true });
      return res.data.redirectUrl;
    } catch (error) {
      console.error('Fetch data error:', error);
      return null;
    }
  };
  return getFetchData;
};