// import mongoose from 'mongoose';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';

// const User = mongoose.models.User || mongoose.model('User', UserSchema);

// export default async function handler(req, res) {
//   await mongoose.connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

//   if (req.method === 'POST') {
//     const { username, password } = req.body;

//     try {
//       const user = await User.findOne({ username });

//       if (!user) {
//         return res.status(401).json({ message: 'Invalid credentials' });
//       }

//       const isMatch = await bcrypt.compare(password, user.password);

//       if (!isMatch) {
//         return res.status(401).json({ message: 'Invalid credentials' });
//       }

//       const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//         expiresIn: '1h',
//       });

//       return res.status(200).json({ token });
//     } catch (error) {
//       console.error('Login error:', error);
//       return res.status(500).json({ message: 'An error occurred during login' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }
import User from '../../../user-service';
import jwt from 'jsonwebtoken';
import connectDB from '../../../utils/connectDB';

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

