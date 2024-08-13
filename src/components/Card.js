// components/Card.js
import React from 'react';
import { Card as BootstrapCard, Button } from 'react-bootstrap';

export default function Card({ flight, index, isClient, handleSelect, handleWishlistToggle, wishlist }) {
  return (
    <BootstrapCard className="mb-4">
      <BootstrapCard.Img
        variant="top"
        src={flight.image_url}
        alt={`${flight.airline} flight image`}
        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
      />
      <BootstrapCard.Body>
        <BootstrapCard.Title>{flight.flight}</BootstrapCard.Title>
        <BootstrapCard.Text>
          Airline: {flight.airline}<br />
          From: {flight.source_city}<br />
          To: {flight.destination_city}<br />
          Departure: {new Date(flight.departure_time).toLocaleTimeString()}<br />
          Arrival: {new Date(flight.arrival_time).toLocaleTimeString()}<br />
          Duration: {flight.duration} hours<br />
          Price: {localStorage.getItem('token') ? `$${flight.price}` : 'Login to see price'}<br />
        </BootstrapCard.Text>
        <Button onClick={() => handleSelect(index)}>Select</Button>
        {isClient && localStorage.getItem('token') && (
          <>
            <Button variant="outline-danger" onClick={() => handleWishlistToggle(index)}>
              <span role="img" aria-label="wishlist" style={{ color: wishlist.includes(index) ? 'black' : 'red' }}>
                ❤️
              </span>
            </Button>
  
          </>
        )}
      </BootstrapCard.Body>
    </BootstrapCard>
  );
}
