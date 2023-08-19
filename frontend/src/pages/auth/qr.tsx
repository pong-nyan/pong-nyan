import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

const QR = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/google2fa/qr`, { responseType: 'blob' })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        setImageUrl(url);
      }).catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      {imageUrl ? <Image src={imageUrl} alt='qrcode' width='300' height='300' /> : <p>Loading...</p>}
      <form action={`${process.env.NEXT_PUBLIC_API_URL}/google2fa/enable`} method='POST'>
        <input type='text' name='code' placeholder='Enter code' />
        <button type='submit'>Submit</button>
      </form>
    </>
  );
};

export default QR;