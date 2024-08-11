const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const mongoose = require('mongoose');
const User = require('./user-service');
require('dotenv').config(); 

const app = express();

const HTTP_PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET ; 


const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
  next(null, { _id: jwt_payload._id, userName: jwt_payload.userName });
});

passport.use(strategy);
app.use(passport.initialize());

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Authentication routes
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, phone, userName, password } = req.body;
    const user = new User({ fullName, emailAddress: email, phoneNo: phone, userName, password });
    await user.save();
    res.json({ message: 'Registration successful! Please log in.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.body.userName });
    if (!user || !await user.comparePassword(req.body.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ _id: user._id, userName: user.userName }, JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/flights', async (req, res) => {
  try {
    const flights = await fetchFlights();
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch flights data' });
  }
});

const fetchFlights = async () => {
  const apiUrl = 'https://script.googleusercontent.com/macros/echo?user_content_key=9CgYreB857S5YE6UzGqJt1Cfnl6jnsYl07J5H_-O2c4GkSbqZrZ33RFeaYATK_Z4CfB7tjVtgCO14dmCPVDPSRxGgPt7AdG8m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnKo9Mx1y9gVJKkomOVf9RyvonW_8TSvWiWN9Kwgize1jdOOUa2Ehg23sGVDjEyCHYViC--exdo4qoue4CRV9cFNs5q7ZljviaQ&lib=MahnT0SVJ5TJwLVdHHKEuSzJGkEaqmmYY';
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error fetching flights data:', error);
    throw error;
  }
};



// 404 Not Found handler
app.use((req, res) => {
  res.status(404).end();
});

app.listen(HTTP_PORT, () => {
  console.log('API listening on:', HTTP_PORT || 8080);
});



app.get('/api/flights/:id', async (req, res) => {
  try {
    const flightId = req.params.id;
    const flights = await fetchFlights();
    const flight = flights.find(f => f.index === flightId);

    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    res.json(flight);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch flight data' });
  }
});
