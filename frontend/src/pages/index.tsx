import useAuth from '@/context/useAuth';

export default function Home() {
  useAuth();

  return (
    <h1>Hello World</h1>
  );
}
