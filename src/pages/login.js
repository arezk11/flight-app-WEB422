import { useState } from 'react';
import { Container, Form, Button, Alert, Row, Col, Navbar, Nav, Card } from 'react-bootstrap';
import { useRouter } from 'next/router';
import styles from '../styles/login.css';

export default function Login() {
  const [userName, setUserName] = useState(''); 
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userName, password }) 
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        router.push('/'); 
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <Container fluid className={styles.container}>
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand href="/">Flight App</Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link href="/login">Login</Nav.Link>
            <Nav.Link href="/register">Register</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className={styles.card}>
          <Card.Body>
            <h2 className="text-center mb-4">Login</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicUserName" className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="rounded-3"
                />
              </Form.Group>
              <Form.Group controlId="formBasicPassword" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-3"
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100 mt-3 rounded-3">
                Login
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Container>
  );
}
