import { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Form, Button, Alert, Pagination, FormControl, Row, Col, Card, Dropdown } from 'react-bootstrap';
import { useRouter } from 'next/router';

export default function Home() {
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [userName, setUserName] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    fetchFlights();

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserName(decodedToken.userName);
      fetchWishlist(decodedToken.userId);
    }
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/flights');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const flightsArray = Array.isArray(data) ? data : Object.values(data);
      setFlights(flightsArray);
      setTotalPages(Math.ceil(flightsArray.length / itemsPerPage));
    } catch (error) {
      setError('Failed to fetch flights data');
    }
  };

  const fetchWishlist = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/wishlist/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setWishlist(data);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filteredFlights = flights.filter(
      (flight) =>
        flight.source_city.toLowerCase().includes(fromCity.toLowerCase()) &&
        flight.destination_city.toLowerCase().includes(toCity.toLowerCase())
    );
    if (filteredFlights.length === 0) {
      setError('No results found');
      setFlights([]);
      setTotalPages(1);
    } else {
      setError('');
      setFlights(filteredFlights);
      setTotalPages(Math.ceil(filteredFlights.length / itemsPerPage));
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSelect = (flightId) => {
    if (isClient) {
      const token = localStorage.getItem('token');
      if (token) {
        window.location.href = `/checkout?flightId=${flightId}`;
      } else {
        window.location.href = '/register';
      }
    }
  };

  const handleLogout = () => {
    if (isClient) {
      localStorage.removeItem('token');
      router.push('/');
    }
  };

  const handleWishlistToggle = async (flightId) => {
    if (isClient) {
      const token = localStorage.getItem('token');
      if (token) {
        const userId = JSON.parse(atob(token.split('.')[1])).userId;
        const isInWishlist = wishlist.some((flight) => flight._id === flightId);

        try {
          if (isInWishlist) {
            await fetch('http://localhost:8080/api/wishlist/remove', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userId, flightId }),
            });
            setWishlist(wishlist.filter((flight) => flight._id !== flightId));
          } else {
            await fetch('http://localhost:8080/api/wishlist/add', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userId, flightId }),
            });
            const flight = flights.find((flight) => flight._id === flightId);
            setWishlist([...wishlist, flight]);
          }
        } catch (error) {
          console.error('Failed to update wishlist:', error);
        }
      } else {
        window.location.href = '/register';
      }
    }
  };

  const indexOfLastFlight = currentPage * itemsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - itemsPerPage;
  const currentFlights = flights.slice(indexOfFirstFlight, indexOfLastFlight);

  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
        {number}
      </Pagination.Item>
    );
  }

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container fluid>
          <Navbar.Brand href="/">
            <i className="fas fa-plane spin-icon" style={{ marginRight: '10px' }}></i>
            Flight App
          </Navbar.Brand>
          <Nav className="ms-auto">
            {isClient && (
              <>
                {localStorage.getItem('token') ? (
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
                          wishlist.map(flight => (
                            <Dropdown.Item key={flight._id}>
                              {flight.flight}
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
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
      <Container className="mt-5">
        <h1>Hello {userName}<br />Where do you want to explore?</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form className="mb-3" onSubmit={handleSearch}>
          <Row>
            <Col>
              <FormControl
                type="search"
                placeholder="From"
                className="me-2"
                aria-label="Search"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
              />
            </Col>
            <Col>
              <FormControl
                type="search"
                placeholder="To"
                className="me-2"
                aria-label="Search"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
              />
            </Col>
            <Col>
              <Button variant="outline-success" type="submit">Search</Button>
            </Col>
          </Row>
        </Form>
        <Row>
          {currentFlights.map(flight => (
            <Col key={flight._id} md={4} lg={3}>
              <Card className="mb-4">
                <Card.Img variant="top" src={flight.image_url} alt={`${flight.airline} flight image`} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Title>{flight.flight}</Card.Title>
                  <Card.Text>
                    Airline: {flight.airline}<br />
                    From: {flight.source_city}<br />
                    To: {flight.destination_city}<br />
                    Departure: {new Date(flight.departure_time).toLocaleTimeString()}<br />
                    Arrival: {new Date(flight.arrival_time).toLocaleTimeString()}<br />
                    Duration: {flight.duration} hours<br />
                    Price: {localStorage.getItem('token') ? `$${flight.price}` : 'Login to see price'}<br />
                  </Card.Text>
                  {isClient && localStorage.getItem('token') && (
                    <Button variant="outline-danger" onClick={() => handleWishlistToggle(flight._id)}>
                      <span role="img" aria-label="wishlist" style={{ color: wishlist.some(w => w._id === flight._id) ? 'black' : 'red' }}>
                        ❤️
                      </span>
                    </Button>
                  )}
                  <Button onClick={() => handleSelect(flight._id)}>Select</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <Pagination>{paginationItems}</Pagination>
      </Container>
      <style jsx>{`
        .spin-icon {
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
