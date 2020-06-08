const fs = require("fs"),
  Docker = require("dockerode"),
  docker = new Docker({socketPath: "/var/run/docker.sock"});

const nodeJudge = async (
  {
    code, testName, testCases
  }, resolve, reject
) => {
  let nonce = Date.now().toString();
  fs.mkdirSync(`/usr/src/app/test/${nonce}`, {recursive: true});
  
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
        userAns = ${testName}(...test);
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

    require("fs").writeFileSync('./test/${nonce}.js', JSON.stringify(results));
  `;

  fs.writeFileSync(`/usr/src/app/test/${nonce}/${nonce}.test`, code + codeTester);

  const judge = () => {
    let containerRef = null;

    docker.createContainer({
      Image: "jorgebarreto/node-judge:1.0.0",
      Cmd: [
        "node",
        `/usr/src/app/test/${nonce}.test`,
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
        let testFile = `/usr/src/app/test/${nonce}/${nonce}.js`,
          results, passed;
  
        if (fs.existsSync(testFile)) {
          results = JSON.parse(fs.readFileSync(testFile).toString());
          // console.log({results});
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
  
        fs.rmdirSync(`/usr/src/app/test/${nonce}`, {recursive: true});
      });
  
      return containerRef.start();
    })
    .then(data => {
      setTimeout(() => {
        containerRef.stop()
          .then(data => console.log("stopping", {data}))
          .catch(e => {})
      }, 10 * 1000); // 10s min limit for processing, ~20s max
      
      return data;
    })
    .catch(err => {
      reject(err);
    });
  }

  images = await docker.listImages({filters: {reference: ["jorgebarreto/node-judge:1.0.0"]}});
  if (images.length < 1) {
    docker.pull("jorgebarreto/node-judge:1.0.0", function (err, stream) {
      docker.modem.followProgress(stream, (err, res) => {
        if (err) return reject({err});
        judge();
      })
    })
  } else {
    judge();
  }
}

module.exports = nodeJudge;
