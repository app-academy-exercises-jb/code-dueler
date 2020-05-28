const express = require("express"),
  jwt = require("jsonwebtoken"),
  cors = require("cors"),
  app = express(),
  bodyParser = require("body-parser"),
  Queue = require("bull");

const jobQueue = new Queue('code-review', process.env.REDIS_URI);

jobQueue.on('error', err => console.log('job error', {err}));
jobQueue.on('stalled', job => console.log('job stalled',{job}));
jobQueue.on('failed', (job,err) => console.log('job failed', {err}));

jobQueue.on('active', (job, jobPromise) => {
  console.log('job started',{job});
});

jobQueue.on('completed', (job, result) => {
  console.log('job completed', {result});
});

app.use(bodyParser.json())
app.use(cors({ origin: process.env.SERVER_URI }));

app.post("/", async (req, res) => {
  res.set("Content-Type", "application/json");

  const { data: { 
    code,
    questionId
  }} = req.body;

  await jobQueue
    .add(Date.now().toString(), {
      code,
      questionId,
    })
    .then(async job => {
      // console.log({job})
      await job
        .finished()
        .then(data => {
          console.log({data})

          res.status(200).send({
            passed: false,
            logs: [],
            error: 'whoops'
          });
        });
    })
    .catch(err => console.log("error processing job",{err}));
  // res.status(200).send({
  //   passed,
  //   ...results,
  //   logs: capturedInfo.logs,
  //   error: capturedInfo.error[0],
  // });
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