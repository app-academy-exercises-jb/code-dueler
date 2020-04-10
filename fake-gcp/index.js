const express = require("express"),
  jwt = require("jsonwebtoken"),
  cors = require("cors"),
  app = express();

app.use(cors({ origin: "http://localhost:3000" }));

app.post("/", (req, res) => {
  res.set("Content-Type", "application/json");

  console.log({ body: req });

  const {
    data: { codeToRun },
  } = req.body;

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

  const testCases = [1, 3, 5, 15, 20, 35];
  testCases.map((t) => ({
    t: fizzBuzzReference(t),
  }));

  const checkedTests = [];

  try {
    eval(codeToRun);

    testCases.forEach((test) => {
      const testCase = Object.keys(test)[0],
        output = fizzBuzz(testCase),
        expected = testCases[test];

      if (output !== expected) {
        return res.status(200).send({
          data: {
            passed: output === expected,
            output,
            expected,
          },
        });
      }

      checkedTests.push();
    });
    return res.status(200).send({
      data: {
        passed: true,
      },
    });
  } catch (error) {
    console.log({ error });
    return res.status(200).send({
      data: {
        passed: false,
        error: error.toString(),
      },
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

exports.app = app;
