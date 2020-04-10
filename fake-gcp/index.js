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
      process.env.SECRET
    );

    if (user) {
      next();
    } else {
      res.end();
    }
  },
);

const checkEquality = (arr1, arr2) => {
  return (
    Array.isArray(arr1) && Array.isArray(arr2) &&
    arr1.length == arr2.length &&
    arr1.every((v,i) => v === arr2[i])
  )
}

app.post("/", (req, res) => {
  res.set("Content-Type", "application/json");

  // console.log(Object.keys(req));
  // console.log(Object.keys(req.res))
  const { data: { codeToRun } } = req.body;

  const fizzBuzzReference = function (n) {
    let ans = [];
    for (let i = 1; i <= n; i++) {
      if (i % 3 === 0 && i % 5 === 0) {
        ans.push("FizzBuzz");
      } else if (i % 3 === 0) {
        ans.push("Fizz");
      } else if (i % 5 === 0) {
        ans.push("Buzz");
      } else {
        ans.push(i.toString());
      }
    }
    return ans;
  };

  const tests = [1, 3, 5, 15, 20, 35];
  const testCases = {};
  
  tests.forEach((t) => {
    testCases[t] = fizzBuzzReference(t);
  });

  const passedTests = [],
    checkedTests = [];

  try {
    eval(codeToRun);
    let expected, output, passed;

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      output = fizzBuzz(test);
      expected = testCases[test];
      passed = checkEquality(output, expected);
      checkedTests.push(test);

      if (!passed) {
        console.log({expected})
        break;
      } 

      passedTests.push(test);
    }

    if (passedTests.length === Object.keys(testCases).length) {
      passed = true;
    }
    
    return res.status(200).send({
      data: {
        passed,
        output: output ? output : "undefined",
        expected,
        checkedTests,
        passedTests
      }
    });
  } catch (error) {
    var util = require('util');
    const output = util.format.apply(util, [error]);

    return res.status(200).send({
      data: {
        passed: false,
        error: output,
      },
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

exports.app = app;
