const graphqlHTTP = require('express-graphql'); 

const graphqlLogger = shouldLog => (req, res, next) => {
    if (!shouldLog) return next();
    graphqlHTTP.getGraphQLParams(req).then(({ query, variables, operationName }) => {
      res.on('finish', function() {
        const operation = operationName || 'no operation specified';
        console.log(
          "\x1b[36m%s%s\x1b[0m",
          operation  
        );
      });
    });
    return next();
  };

const passportAuthenticate = passport => (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (user) req.user = user;
    next();
  })(req, res, next);
}

module.exports = {
  graphqlLogger,
  passportAuthenticate
};
