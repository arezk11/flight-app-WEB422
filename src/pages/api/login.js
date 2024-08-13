import User from '../../../user-service';
import jwt from 'jsonwebtoken';
import connectDB from '../../utlis/connectDB';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectDB();

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
}

