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

  let nonce = `${Date.now()}`;

  fs.mkdirSync(`./test/${nonce}`);
  
  // capture console.log and console.error and send them to 
  let codeTester = `\n\n
    const isEqual = require('lodash.isequal'),
      testCases = ${JSON.stringify(testCases)};

    let results = {},
      score = 0;

    for (let i = 0; i < testCases.length; i++) {
      let [test, sol] = testCases[i],
        userAns;
      try {
        userAns = ${testName}(test);
      } catch (error) {
        console.error(error);
        process.exit(1);
      }

      if (isEqual(userAns, sol)) {
        score++;
      } else {
        results = {
          test,
          expected: sol,
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

  await docker.createContainer({
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
  .then(async container => {
    containerRef = container;
    return await containerRef.attach({
      stream: true,
      stdout: true,
      stderr: true
    });
  })
  .then(async stream => {
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
            results, passed, score;
          if (fs.existsSync(testFile)) {
            results = JSON.parse(fs.readFileSync(testFile).toString());
            passed = results.score === 1;
            score = results.score;
          } else {
            passed = false;
            score = 0;
          }

          res.status(200).send({
            passed,
            ...results,
            logs: capturedInfo.logs,
            error: capturedInfo.error[0],
          });
          fs.rmdirSync(`./test/${nonce}`, {recursive: true});
        });
    });

    return await containerRef.start();
  })
  .then(async data => {
    setTimeout(() => {
      containerRef.stop()
        .then(data => console.log("stopping", {data}))
        .catch(e => {})
    }, 10 * 1000); // 10second hard limit for processing
    
    return await data;
  })
  .catch(err => {
    console.log({err});
    res.sendStatus(500);
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

exports.app = app;
