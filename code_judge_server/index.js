const express = require("express"),
  jwt = require("jsonwebtoken"),
  cors = require("cors"),
  app = express(),
  bodyParser = require("body-parser");

app.use(bodyParser.json())
app.use(cors({ origin: process.env.SERVER_URI }));

app.post("/", async (req, res) => {
  res.set("Content-Type", "application/json");

  const { data: { 
    code,
    testCases,
    testName,
    language
  }} = req.body;

  // res.status(200).send({
  //   passed,
  //   ...results,
  //   logs: capturedInfo.logs,
  //   error: capturedInfo.error[0],
  // });

  res.status(200).send({
    passed: false,
    logs: [],
    error: 'whoops'
  })
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

exports.app = app;

// const fizzBuzzReference = function (n) {
  // let ans = [];
  // for (let i = 1; i <= n; i++) {
  //   if (i % 3 === 0 && i % 5 === 0) {
  //     ans.push("FizzBuzz");
  //   } else if (i % 3 === 0) {
  //     ans.push("Fizz");
  //   } else if (i % 5 === 0) {
  //     ans.push("Buzz");
  //   } else {
  //     ans.push(i.toString());
  //   }
  // }
  // return ans;
// };