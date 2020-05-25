const express = require("express"),
  jwt = require("jsonwebtoken"),
  cors = require("cors"),
  app = express(),
  bodyParser = require('body-parser');

app.use(bodyParser.json())
app.use(cors({ origin: "http://localhost:3000" }));


app.use(
  "/",
  async (req, res, next) => {
    if (!req.headers.authorization) return res.end();

    const user = jwt.verify(
      req.headers.authorization.replace('Bearer ', ''),
      process.env.SECRET_OR_KEY
    );

    if (user) {
      next();
    } else {
      res.end();
    }
  },
);

app.get("/", (req, res) => {
  console.log('here')
});

app.post("/", (req, res) => {
  res.set("Content-Type", "application/json");

  const { data: { codeToRun } } = req.body;

  console.log({codeToRun});

});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

exports.app = app;



// const fizzBuzzReference = function (n) {
//   let ans = [];
//   for (let i = 1; i <= n; i++) {
//     if (i % 3 === 0 && i % 5 === 0) {
//       ans.push("FizzBuzz");
//     } else if (i % 3 === 0) {
//       ans.push("Fizz");
//     } else if (i % 5 === 0) {
//       ans.push("Buzz");
//     } else {
//       ans.push(i.toString());
//     }
//   }
//   return ans;
// };