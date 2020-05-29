const express = require("express"),
  jwt = require("jsonwebtoken"),
  cors = require("cors"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  fs = require("fs"),
  Docker = require("dockerode"),
  docker = new Docker({socketPath: "/var/run/docker.sock"}),
  Queue = require("bull");

require('./Question');

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log("Connected to MongoDb"))
  .catch((err) => console.log(`Could not connect to MongoDB: ${err}`));


const jobQueue = new Queue('code-review', process.env.REDIS_URI);

jobQueue.on('error', err => console.log('job error', {err}));
jobQueue.on('stalled', job => console.log('job stalled',{job}));
jobQueue.on('failed', (job,err) => console.log('job failed', {err}));

// jobQueue.on('completed', (job, result) => {
//   console.log('job completed in worker', {result});
// });

jobQueue.process('submitCode', async job => {
  const Question = mongoose.model('Question'),
    { code, challenge, language } = job.data,
    {
      functionNames,
      testCases
    } = await Question.findOne({ challenge });
    // remember that all question testCases are JSON strings

  const testName = functionNames.find(fn => fn.language === language).name;

  return new Promise((resolve, reject) => {

  let nonce = `${Date.now()}`;
  fs.mkdirSync(`./test/${nonce}`);
  
  let codeTester = `\n\n
    const isEqual = require('lodash.isequal'),
      testCases = ${JSON.stringify(testCases)};

    let results = {},
      score = 0;

    for (let i = 0; i < testCases.length; i++) {
      let {test, solution} = testCases[i],
        userAns;
      test = JSON.parse(test);
      solution = JSON.parse(solution);

      try {
        userAns = ${testName}(test);
      } catch (error) {
        console.error(error);
        process.exit(1);
      }

      if (isEqual(userAns, solution)) {
        score++;
      } else {
        results = {
          test,
          expected: solution,
          output: userAns,
          ...results
        };
        break;
      }
    }

    score = score / ${testCases.length};
    if (score !== 0 && score !== 1) score = parseFloat(score.toFixed(2));
    results.score = score;

    fs.writeFileSync('./test/${nonce}.js', JSON.stringify(results));
  `;
  let containerRef = null;

  docker.createContainer({
    Image: "node-judge",
    Cmd: [
      "node",
      "-e",
      code + codeTester,
    ],
    NetworkDisabled: true,
    WorkingDir: "/usr/src/app",
    Tty: false,
    HostConfig: {
      Memory: 128 * 1024 * 1024, //128MB
      Binds: [
        `${process.env.TESTING_DIR}/${nonce}:/usr/src/app/test:rw`
      ],
      DiskQuota: 1024,
      NetworkMode: "none",
      AutoRemove: true,
    }
  })
  .then(container => {
    containerRef = container;
    return containerRef.attach({
      stream: true,
      stdout: true,
      stderr: true
    });
  })
  .then(stream => {
    let capturedInfo = {
      error: [],
      logs: [],
      write: (stream) => ({
        write: data => {
          let key = stream === 'err' ? 'error' : 'logs';
          capturedInfo[key].push(data.toString().trim());
        }
      })
    };

    containerRef.modem.demuxStream(stream, capturedInfo.write("log"), capturedInfo.write("err"));
    
    stream.on('end', () => {
      containerRef.inspect()
        .then(data => {
          let testFile = `./test/${nonce}/${nonce}.js`,
            results, passed;

          if (fs.existsSync(testFile)) {
            results = JSON.parse(fs.readFileSync(testFile).toString());
            passed = results.score === 1;
            score = results.score;
          } else {
            passed = false;
            score = 0;
          }

          resolve({
            passed,
            ...results,
            logs: capturedInfo.logs,
            error: capturedInfo.error[0],
          });

          fs.rmdirSync(`./test/${nonce}`, {recursive: true});
        });
    });

    return containerRef.start();
  })
  .then(data => {
    setTimeout(() => {
      containerRef.stop()
        .then(data => console.log("stopping", {data}))
        .catch(e => {})
    }, 0 * 1000); // 10second hard limit for processing
    
    return data;
  })
  .catch(err => {
    reject(err);
  });

  });
});

exports.app = app;
