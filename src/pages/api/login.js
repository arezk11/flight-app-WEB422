// import mongoose from 'mongoose';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';

// const User = mongoose.models.User || mongoose.model('User', UserSchema);

<<<<<<< HEAD
// export default async function handler(req, res) {
//   await mongoose.connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
=======
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },

});
>>>>>>> 9c81390400199b36de292122887736b3f5a28e3e

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
