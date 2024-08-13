import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Form, Navbar, Nav, Alert, Button } from 'react-bootstrap';
import Card from '../components/Card'; 

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
        const response = await fetch('https://script.googleusercontent.com/macros/echo?user_content_key=9CgYreB857S5YE6UzGqJt1Cfnl6jnsYl07J5H_-O2c4GkSbqZrZ33RFeaYATK_Z4CfB7tjVtgCO14dmCPVDPSRxGgPt7AdG8m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnKo9Mx1y9gVJKkomOVf9RyvonW_8TSvWiWN9Kwgize1jdOOUa2Ehg23sGVDjEyCHYViC--exdo4qoue4CRV9cFNs5q7ZljviaQ&lib=MahnT0SVJ5TJwLVdHHKEuSzJGkEaqmmYY');
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

  
    setConfirmation(`Your booking is confirmed! A confirmation has been sent to ${email}.`);
  };

  const getUserEmail = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.emailAddress; 
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
          Your Wings to Explore!
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
                <Card
                  flight={flight}
                  index={index}
                  isClient={false} 
                  handleSelect={() => {}}
                  handleWishlistToggle={() => {}}
                  wishlist={[]}
                  showSelectButton={false}
                />
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
