/* eslint-env node */
const path = require('path');
const { compare } = require('odiff-bin');
const mkdirp = require('mkdirp');
const fs = require('fs');
const { nanoid } = require('nanoid');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const removeFile = promisify(fs.unlink);

async function saveImage({ filePath, content }) {
  await mkdirp(path.dirname(filePath));
  await writeFile(filePath, content);
}

async function imageDiff({ baselineImage, image, options }) {
  const diffOptions = {
    threshold: options.threshold,
    antialiasing: true
  };

  const id = nanoid();

  // TODO: https://github.com/dmtrKovalenko/odiff/issues/53
  const tmpOldImagePath = path.resolve(`tmp/${id}-baseline.png`);
  const tmpNewImagePath = path.resolve(`tmp/${id}-actual.png`);
  const tmpDiffPath = path.resolve(`tmp/${id}-diff.png`);

  await saveImage({ filePath: tmpOldImagePath, content: baselineImage });
  await saveImage({ filePath: tmpNewImagePath, content: image });

  const { match, reason, diffPercentage } = await compare(tmpOldImagePath, tmpNewImagePath, tmpDiffPath, diffOptions);

  const doNotMatch = match == false;

  const result = {
    error: doNotMatch ? reason : false,
    diffPercentage: diffPercentage || 0
  };

  if (doNotMatch) {
    result.diffImage = await readFile(tmpDiffPath);
    await removeFile(tmpDiffPath);
  }

  await removeFile(tmpOldImagePath);
  await removeFile(tmpNewImagePath);

  return result;
}

module.exports = {
  imageDiff
};
