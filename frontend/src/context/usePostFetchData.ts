import axios from 'axios';

export const usePostFetchData = (url: string, option?: object) => {
  const postFetchData = async () => {
    try {
      const res = await axios.post(url, option, { withCredentials: true });
      return res.data.redirectUrl;
    } catch (error) {
      console.error('Fetch data error:', error);
      return null;
    }
  };
  return postFetchData;
};