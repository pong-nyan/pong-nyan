import axios from 'axios';

export const usePostFetchData = (url: string, option?: object) => {
  const postFetchData = async () => {
    try {
      const res = await axios.post(url, { withCredentials: true }, option);
      return res.data.redirectUrl;
    } catch (error) {
      console.error('Fetch data error:', error);
      return null;
    }
  };
  return postFetchData;
};