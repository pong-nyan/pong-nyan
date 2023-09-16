import axios from 'axios';

export const usePostFetchData = (url: string, option?: object) => {
  const postFetchData = async () => {
    try {
      const res = await axios.post(url, option, { withCredentials: true });
      return res.data.redirectUrl;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error : any) {
      if (error?.response?.status === 401) {
        alert('로그인이 필요합니다.');
        localStorage.removeItem('user');
        location.replace('/auth');
        return null;
      }
      alert(error?.response?.data?.message || '서버와 통신에 실패했습니다.');
      console.error('Fetch data error:', error);
      return null;
    }
  };
  return postFetchData;
};