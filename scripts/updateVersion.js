#!/usr/bin/env node
const spawn = require('cross-spawn');
const replace = require('replace-in-file');
const oldVersion = require('../lerna.json').version;

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
    if (!quiet) {
      process.stdout.write(s);
    }
    out += s;
  };

  child.stdout.on('data', capture);
  child.stderr.on('data', capture);

  return new Promise((resolve, reject) => {
    child.on('exit', async (code) => {
      if (code === 0) {
        resolve(out);
      } else {
        reject(`${quiet ? out : ''}\n!!! ERROR !!! Process '${cmd}' exited with code ${code}`);
      }
    });
  });
}

const version = process.env.npm_config_bump;
if (!version) {
  throw new Error('No new version found');
}

async function main() {
  const fromRegex = new RegExp(`'${oldVersion.split('.').join('\\.')}'`, 'g');
  const newVersion = `'${version.replace(/^v/, '')}'`;
  const results = await replace({
    files: ['packages/**/version.{js,ts}', 'packages/component-base/src/*.{js,ts}'],
    from: fromRegex,
    to: newVersion
  });
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
