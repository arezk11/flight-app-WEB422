import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function MyNavbar({ userName, wishlist, flights }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/logout');
  };

  return (
    <Navbar bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand href="/">
          <i className="fas fa-plane spin-icon" style={{ marginRight: '10px' }}></i>
          Your Wings to Explore!
        </Navbar.Brand>
        <Nav className="ms-auto">
          {isClient && localStorage.getItem('token') ? (
            <>
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              <Navbar.Text className="ms-2">Welcome, {userName}</Navbar.Text>

              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-wishlist">
                  <span role="img" aria-label="wishlist">❤️</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {wishlist.length > 0 ? (
                    wishlist.map(flightIndex => (
                      <Dropdown.Item key={flightIndex}>
                        {flights[flightIndex]?.flight || 'Flight'}
                      </Dropdown.Item>
                    ))
                  ) : (
                    <Dropdown.Item>No items in wishlist</Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </>
          ) : (
            <>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/register">Register</Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
