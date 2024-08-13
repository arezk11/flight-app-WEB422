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
