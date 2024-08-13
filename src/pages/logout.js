// import { Button, Container } from 'react-bootstrap';
// import { useRouter } from 'next/router';

// export default function Logout() {
//   const router = useRouter();

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     router.push('/');
//   };

//   return (
//     <Container>
//       <Button onClick={handleLogout}>Logout</Button>
//     </Container>
//   );
// }
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('token');
    router.push('/');
  }, [router]);

  return null; // No need to render anything
}
