import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  flights: [{ type: String, required: true }],
});

const Wishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default async (req, res) => {
  await connectDB();

  const { method } = req;

  switch (method) {
    case 'POST':
      const { userId, flightId } = req.body;
      try {
        const wishlist = await Wishlist.findOneAndUpdate(
          { userId },
          { $addToSet: { flights: flightId } },
          { upsert: true, new: true }
        );
        res.status(200).json({ message: 'Flight added to wishlist', wishlist });
      } catch (error) {
        res.status(500).json({ error: 'Failed to add flight to wishlist' });
      }
      break;

    case 'GET':
      const { userId: queryUserId } = req.query;
      try {
        const wishlist = await Wishlist.findOne({ userId: queryUserId });
        if (!wishlist) {
          return res.status(404).json({ message: 'Wishlist not found' });
        }
        res.status(200).json(wishlist);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch wishlist' });
      }
      break;

    default:
      res.setHeader('Allow', ['POST', 'GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
};
