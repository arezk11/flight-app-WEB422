const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  emailAddress: { type: String, unique: true, required: true },
  phoneNo: { type: String, required: true },
  userName: { type: String, unique: true, required: true },
  password: { type: String, required: true },
 
});
// wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Flight' }]

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});


userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
