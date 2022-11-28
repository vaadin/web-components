import micromatch from 'micromatch';

export default (files) => {
  let matched = micromatch(files, ['**/*.tsx?']);
  matched = micromatch.not(matched, ['node_modules/**/*']);

  return matched.length > 0 ? [`prettier --write ${matched.join(' ')}`] : [];
};
