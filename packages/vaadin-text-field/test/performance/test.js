const minimumPerformanceThreshold = 0.75;

/**
 * Html files to test performance of.
 */
const tests = [
  'test/performance/index.html'
];

const path = require('path');
const lighthouseBin = require(path.join('lighthouse', 'package.json')).bin.lighthouse;
const lighthouseCliPath = require.resolve(path.join('lighthouse', lighthouseBin));
const elementName = require(path.join(process.cwd(), 'package.json')).name;
const exec = require('child_process').exec;
const polyserve = require('polyserve');

function runTest(testPath) {
  return new Promise((fulfill, reject) => {
    console.log(`Running lighthouse performance report for ${testPath}...`);

    const testUrl = `http://localhost:7777/components/${elementName}/${testPath}`;
    exec(
      `node ${lighthouseCliPath} --perf --output=json ${testUrl}`,
      {maxBuffer: 2 * 1024 * 1024},
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }

        const results = JSON.parse(stdout);
        // const total = results.aggregations[0].total; // lighthouse v1.4.0+ format
        const total = results.aggregations[0].score[0].overall; // older format
        if (total === undefined) {
          reject('Failed: performance score is undefined.')
        } else {
          console.log(`Done with total score: ${total}.`);
        }

        const failed = total < minimumPerformanceThreshold;
        if (failed) {
          reject('Failed: performance score is too low.');
        } else {
          fulfill();
        }
      }
    );
  });
}

function dequeueNextTest() {
  if (tests.length) {
    const nextTest = tests.shift();
    return runTest(nextTest)
      .then(dequeueNextTest)
  } else{
    return Promise.resolve();
  }
}

function runTests(polyserveStartResults) {
  const server = polyserveStartResults.server;
  dequeueNextTest()
    .then(() => {
      console.log('Performance tests have completed successfully.');
      server.close();
      process.exit();
    })
    .catch((e) => {
      // Error or failed test. Report to strerr and set error exit code.
      console.error(e);
      server.close();
      process.exitCode = 1;
      process.exit();
    });
}

polyserve.startServers({port: 7777})
  .then(runTests)
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
