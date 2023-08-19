import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

const QR = () => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    // axios call to get the QR code /google2fa/qr
    // then display the QR code

    axios.post<Blob>(`${process.env.NEXT_PUBLIC_API_URL}/google2fa/qr`, { responseType: 'blob' })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        setImageUrl(url);
        // res.data 를 화면에 출
      }).catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Image src={imageUrl} alt='qrcode' width='300' height='300' />
  );
};

export default QR;
    