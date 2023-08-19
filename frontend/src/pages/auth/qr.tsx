import { useEffect } from 'react';
import axios from 'axios';

const QR = () => {

  useEffect(() => {
    // axios call to get the QR code /google2fa/qr
    // then display the QR code

    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/google2fa/qr`)
      .then((res) => {
        console.log(res);
      }).catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <p>qr</p>
  );
};

export default QR;
    