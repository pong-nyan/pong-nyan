import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en"> 
      <Head> 
        <link rel="icon" href="/static/pong-nyan.png"/> 
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
