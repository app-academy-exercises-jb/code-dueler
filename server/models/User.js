const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcryptjs'),
  secretOrKey = require('../config/keys').secretOrKey;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 32
  }
});

UserSchema.statics.login = async function (username, password) {
  const User = this,
    user = await User.findOne({ username });

  if (user && (await bcrypt.compare(password, user.password))) {
    user.token = "Bearer " + jwt.sign({ _id: user._id }, secretOrKey);
    user.loggedIn = true;
    return user;
  }
  return null;
};

UserSchema.statics.signup = async function (username, password) {
  const User = this,
    user = await User.findOne({ username });

  
  if (user) return null;

  const newUser = new User({username, password: await bcrypt.hash(password, 10)});

  console.log("hello")
  await newUser.save();

  newUser.token = "Bearer " + jwt.sign({ _id: newUser._id }, secretOrKey);
  newUser.loggedIn = true;

  console.log(newUser);
  return newUser;
};

module.exports = mongoose.model('User', UserSchema);