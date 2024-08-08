import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Checkout() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/register');
    }
  }, [router]);

  return (
    <div>
      <h1>Checkout Page</h1>
      <p>Proceed with your flight booking.</p>
    </div>
  );
}
