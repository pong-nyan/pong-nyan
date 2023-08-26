import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';

const QR = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/google2fa/qr`, { responseType: 'blob' })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        setImageUrl(url);
      }).catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = e.currentTarget.code.value;
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/google2fa/enable`, { code }, { withCredentials: true })
      .then((res) => {
        if (res.data === 'success') {
          router.replace('/auth/signin');
        } else if (res.data === 'failed') {
          alert('Enable failed. Please try again.');
        }
      }
      ).catch((err) => {
        console.log(err);
      }
    );
  };
  return (
    <>
      {imageUrl ? <Image src={imageUrl} alt='qrcode' width='300' height='300' /> : <p>Loading...</p>}
      <form onSubmit={ handleSubmit }>
        <input type='text' name='code' placeholder='Enter code' />
        <button type='submit'>Submit</button>
      </form>
    </>
  );
};

export default QR;