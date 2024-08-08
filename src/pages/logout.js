import { Button, Container } from 'react-bootstrap';
import { useRouter } from 'next/router';

export default function Logout() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <Container>
      <Button onClick={handleLogout}>Logout</Button>
    </Container>
  );
}
