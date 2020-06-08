const fs = require("fs"),
  Docker = require("dockerode"),
  docker = new Docker({socketPath: "/var/run/docker.sock"});

const rubyJudge = async ({
  code, testName, testCases
}, resolve, reject) => {
  let nonce = `${Date.now()}`;
  fs.mkdirSync(`/usr/src/app/test/${nonce}`, {recursive: true});
  
  let codeTester = `\n\n
    require 'json'
    test_cases = ${JSON.stringify(testCases)}

    results = {}
    score = 0

    for i in 0..${testCases.length - 1}
      testcase = test_cases[i]
      test = JSON.parse(testcase[:test])
      solution = JSON.parse(testcase[:solution])

      user_sol = ${testName}(*test)

      if (user_sol === solution)
        score += 1
      else
        results = {
          test: test,
          expected: solution,
          output: user_sol
        }
        break
      end
    end

    score = (score * 1.0) / ${testCases.length};
    results[:score] = score.round(2);

    File.write('./test/${nonce}.rb', JSON.generate(results));
  `;

  fs.writeFileSync(`/usr/src/app/test/${nonce}/${nonce}.test`, code + codeTester);


  const judge = () => {
    let containerRef = null;
    docker.createContainer({
      Image: "ruby:2.7.1-alpine",
      Cmd: [
        "ruby",
        `test/${nonce}.test`,
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
        console.log({capturedInfo})
        containerRef.inspect()
          .then(data => {
            let testFile = `./test/${nonce}/${nonce}.rb`,
              results, passed;

            if (fs.existsSync(testFile)) {
              results = JSON.parse(fs.readFileSync(testFile).toString());
              passed = results.score === 1;
              score = results.score;
            } else {
              console.log("nope")
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
      }, 10 * 1000); // 10s min limit for processing, ~20s max
      
      return data;
    })
    .catch(err => {
      reject(err);
    });
  }

  images = await docker.listImages({filters: {reference: ["ruby:2.7.1-alpine"]}});
  if (images.length < 1) {
    docker.pull("ruby:2.7.1-alpine", function (err, stream) {
      docker.modem.followProgress(stream, (err, res) => {
        if (err) return reject({err});
        judge();
      })
    })
  } else {
    judge();
  }
}

module.exports = rubyJudge;
