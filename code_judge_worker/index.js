const express = require("express"),
  jwt = require("jsonwebtoken"),
  cors = require("cors"),
  app = express(),
  bodyParser = require("body-parser"),
  fs = require("fs"),
  Docker = require("dockerode"),
  docker = new Docker({socketPath: "/var/run/docker.sock"}),
  Queue = require("bull");


const jobQueue = new Queue('code-review', process.env.REDIS_URI);

jobQueue.on('error', err => console.log('job error', {err}));
jobQueue.on('stalled', job => console.log('job stalled',{job}));
jobQueue.on('failed', (job,err) => console.log('job failed', {err}));

// jobQueue.on('completed', (job, result) => {
//   console.log('job completed in worker', {result});
// });

jobQueue.process('*', job => {
  // console.log("processing", {data: job.data});

  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("bar"), 1000);
  });
});

exports.app = app;
