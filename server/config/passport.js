const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt,
  mongoose = require("mongoose"),
  User = mongoose.model("User");

const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.SECRET_OR_KEY;

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(options, async (token, done) => {
      if (token) {
        const user = await User.findById(token._id);
        return done(null, user);
      }
      return done(null, false);
    })
  );
};
