const express = require("express"),
  jwt = require("jsonwebtoken"),
  cors = require("cors"),
  app = express(),
  bodyParser = require("body-parser"),
  fs = require("fs"),
  Docker = require("dockerode"),
  docker = new Docker({socketPath: "/var/run/docker.sock"});

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


  let passedTests = 0
    attemptedTests = 0;

  for (let idx = 0; idx < testCases.length; idx++) {
    const [test, sol] = testCases[idx];
    // capture console.log and console.error and send them to 
    let codeTester = `\n\n
      const isEqual = require('lodash.isequal'),
        userAns = ${testName}(${test}),
        sol = ${JSON.stringify(sol)};
      if (!isEqual(userAns, sol))
        process.exit(1);
    `;

    let containerRef = null;

    await docker.createContainer({
      Image: "node-judge",
      Cmd: [
        "node",
        "-e",
        code + codeTester,
      ],
      NetworkDisabled: true,
      WorkingDir: "/usr/src/app",
      Tty: true,
      HostConfig: {
        Memory: 128 * 1024 * 1024, //128MB
        DiskQuota: 1024,
        NetworkMode: "none",
        AutoRemove: true,
      }
    })
    .then(async container => {
      containerRef = container;
      return await containerRef.attach({
        stream: true,
        stdout: false,
        stderr: true
      });
    })
    .then(async stream => {
      containerRef.modem.demuxStream(stream, process.stdout, process.stderr);
      
      stream.on('end', () => {
        containerRef.inspect()
          .then(data => {
            // console.log({state: data.State})
            if (data.State.ExitCode === 0) passedTests ++;
            attemptedTests++;

            if (attemptedTests === testCases.length) {
              res.status(200).send({
                data: {
                  passed: passedTests === testCases.length,
                  score: passedTests / testCases.length,
                }
              });
            }
          });
      });

      // stream.on('data', () => console.log("received data up front"))

      return await containerRef.start();
    })
    .then(async data => {
      setTimeout(() => {
        containerRef.stop()
          .then(data => console.log("stopping", {data}), passedTests--)
          .catch(e => {})
      }, 10 * 1000); // 10second hard limit for processing
      
      return await data;
    })
    .catch(err => {
      console.log({err});
      res.sendStatus(500);
    });
  }
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