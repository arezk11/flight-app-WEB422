import { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Pagination, FormControl, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/router';
import MyNavbar from '../components/Navbar';
import Card from '../components/Card'; 

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
    }

    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await fetch('https://script.googleusercontent.com/macros/echo?user_content_key=9CgYreB857S5YE6UzGqJt1Cfnl6jnsYl07J5H_-O2c4GkSbqZrZ33RFeaYATK_Z4CfB7tjVtgCO14dmCPVDPSRxGgPt7AdG8m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnKo9Mx1y9gVJKkomOVf9RyvonW_8TSvWiWN9Kwgize1jdOOUa2Ehg23sGVDjEyCHYViC--exdo4qoue4CRV9cFNs5q7ZljviaQ');
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

  const handleSelect = (index) => {
    if (isClient) {
      const token = localStorage.getItem('token');
      if (token) {
        router.push(`/checkout?index=${index}`);
      } else {
        router.push('/register');
      }
    }
  };

  const handleLogout = () => {
    if (isClient) {
      localStorage.removeItem('token');
      router.push('/');
    }
  };

  const handleWishlistToggle = (index) => {
    const isFlightInWishlist = wishlist.includes(index);
    if (isFlightInWishlist) {
      setWishlist(wishlist.filter(flightIndex => flightIndex !== index));
    } else {
      setWishlist([...wishlist, index]);
    }

    localStorage.setItem('wishlist', JSON.stringify(isFlightInWishlist ? wishlist.filter(flightIndex => flightIndex !== index) : [...wishlist, index]));
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
      <MyNavbar userName={userName} handleLogout={handleLogout} wishlist={wishlist} flights={flights} />
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
          {currentFlights.map((flight, index) => (
            <Col key={index} md={4} lg={3}>
              <Card
                flight={flight}
                index={index}
                isClient={isClient}
                handleSelect={handleSelect}
                handleWishlistToggle={handleWishlistToggle}
                wishlist={wishlist}
              />
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
