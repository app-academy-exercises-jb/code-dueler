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


// app.use(
//   "/",
//   async (req, res, next) => {
//     if (!req.headers.authorization) return res.end();

//     const user = jwt.verify(
//       req.headers.authorization.replace("Bearer ", ""),
//       process.env.SECRET_OR_KEY
//     );

//     if (user) {
//       next();
//     } else {
//       res.end();
//     }
//   },
// );

app.post("/", (req, res) => {
  res.set("Content-Type", "application/json");

  const { data: { code }} = req.body;
  fs.writeFileSync("./test/test.js", code);

  let containerRef = null;

  docker.createContainer({
    Image: "node:13.12.0-alpine",
    Cmd: [
      "node",
      "test.js",
    ],
    NetworkDisabled: true,
    WorkingDir: "/usr/src/app",
    // AttachStdout: true,
    // Tty: true,
    HostConfig: {
      Memory: 128 * 1024 * 1024, //128MB
      DiskQuota: 1024,
      Binds: [
        `${process.env.TESTING_DIR}:/usr/src/app:ro`
      ],
      NetworkMode: "none",
      AutoRemove: true,
    }
  })
  .then(container => {
    containerRef = container;
    return container.start();
  })
  .then(data => {
    setTimeout(() => {
      containerRef.inspect((err, data) => {
        if (err) return;
        if (data.State.Status === 'running') 
          console.log("stopping"), containerRef.stop();
      });
    }, 10 * 1000); // 10second hard limit for processing
  })
  .catch(err => console.log({err}));

  return res.status(200).send({
    data: { isTrue: true }
  })
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