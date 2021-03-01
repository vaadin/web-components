#!/usr/bin/env node
const spawn = require('cross-spawn');
const replace = require('replace-in-file');

/**
 * Runs the command without opening a new shell.
 * It prints stdout and stderr at the same time that captures it in
 * order to be passed in the resolved promise.
 */
async function exe(cmd, quiet) {
  const args = cmd.split(/ +/);
  const child = spawn(args[0], args.slice(1));

  let out = '';
  const capture = (data) => {
    const s = data.toString('utf-8');
    !quiet && process.stdout.write(s);
    out += s;
  };

  child.stdout.on('data', capture);
  child.stderr.on('data', capture);

  return new Promise((resolve, reject) =>
    child.on('exit', async function (code) {
      if (code == 0) {
        resolve(out);
      } else {
        reject(`${quiet ? out : ''}\n!!! ERROR !!! Process '${cmd}' exited with code ${code}`);
      }
    })
  );
}

const oldVersion = process.env.npm_config_version;
if (!oldVersion) {
  console.log('No old version found');
  process.exit(1);
}

const version = process.env.npm_config_bump;
if (!version) {
  console.log('No new version found');
  process.exit(1);
}

async function main() {
  const fromRegex = new RegExp(oldVersion, 'g');
  const newVersion = version.replace(/^v/, '');
  const results = await replace({ files: ['packages/**/src/*.{js,ts}'], from: fromRegex, to: newVersion });
  const changes = results.filter((result) => result.hasChanged).map((result) => result.file);

  // Stage the changes for the new version tag commit
  if (changes.length) {
    await exe(`git update-index -- ${changes.join(' ')}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
