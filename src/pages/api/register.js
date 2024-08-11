// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// const UserSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
// });

// const User = mongoose.models.User || mongoose.model('User', UserSchema);

// export default async function handler(req, res) {
//   await mongoose.connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

//   if (req.method === 'POST') {
//     const { username, password, email } = req.body;

//     try {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const newUser = new User({
//         username,
//         password: hashedPassword,
//         email,
//       });
//       await newUser.save();
//       res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//       if (error.code === 11000) {
//         return res.status(400).json({ message: 'Username or email already exists' });
//       }
//       res.status(500).json({ message: 'An error occurred during registration' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }
import User from '../../../user-service';
import connectDB from '../../utlis/connectDB';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectDB();

  try {
    const { fullName, email, phone, userName, password } = req.body;
    const user = new User({ fullName, emailAddress: email, phoneNo: phone, userName, password });
    await user.save();
    res.json({ message: 'Registration successful! Please log in.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
