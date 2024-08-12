import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Card, Button, Form, Navbar, Nav, Alert } from 'react-bootstrap';

export default function Checkout() {
  const [flight, setFlight] = useState(null);
  const [passengerName, setPassengerName] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const router = useRouter();
  const { index } = router.query;

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const response = await fetch('/api/flights');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched flights data for checkout:', data);

        const flightsArray = Array.isArray(data) ? data : Object.values(data);
        const selectedFlight = flightsArray[index];
        if (selectedFlight) {
          setFlight(selectedFlight);
        } else {
          setError('Flight not found');
        }
      } catch (error) {
        setError('Failed to fetch flight details');
      }
    };

    if (index !== undefined) {
      fetchFlight();
    }
  }, [index]);

  const handleBooking = () => {
    if (!passengerName || !email) {
      setError('Please fill in all the fields.');
      return;
    }

    // Simulate booking confirmation
    setConfirmation(`Your booking is confirmed! A confirmation has been sent to ${email}.`);
  };

  const getUserEmail = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.emailAddress; // Ensure this matches the field in your token
    }
    return '';
  };

  useEffect(() => {
    setEmail(getUserEmail());
  }, []);

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container fluid>
          <Navbar.Brand href="/">
            <i className="fas fa-plane spin-icon" style={{ marginRight: '10px' }}></i>
            Flight App
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/logout">Logout</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container className="mt-5">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {confirmation && <Alert variant="success">{confirmation}</Alert>}
        {flight ? (
          <>
            <h2>Checkout</h2>
            <Row>
              <Col md={6}>
                <Card>
                  <Card.Img variant="top" src={flight.image_url} alt={`${flight.airline} flight image`} />
                  <Card.Body>
                    <Card.Title>{flight.flight}</Card.Title>
                    <Card.Text>
                      <strong>Airline:</strong> {flight.airline}<br />
                      <strong>From:</strong> {flight.source_city}<br />
                      <strong>To:</strong> {flight.destination_city}<br />
                      <strong>Departure:</strong> {new Date(flight.departure_time).toLocaleTimeString()}<br />
                      <strong>Arrival:</strong> {new Date(flight.arrival_time).toLocaleTimeString()}<br />
                      <strong>Duration:</strong> {flight.duration} hours<br />
                      <strong>Price:</strong> ${flight.price}<br />
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <h3>Passenger Details</h3>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Passenger Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your name"
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Payment Method</Form.Label>
                    <Form.Select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="credit_card">Credit Card</option>
                      <option value="paypal">PayPal</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </Form.Select>
                  </Form.Group>
                  <Button variant="primary" onClick={handleBooking}>Book Flight</Button>
                </Form>
              </Col>
            </Row>
          </>
        ) : (
          <p>Loading flight details...</p>
        )}
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
