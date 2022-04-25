#!/usr/bin/env node

/**
 * Create release notes.
 *
 * Example
 *   ./scripts/generateReleaseNotes.js --from from_tag --to to_tag --compact
 *
 * When --to is not given the latest tag is selected.
 * When --from is not given the previous tag is selected.
 * When --compact is set, components are not listed, default is false
 */

const exec = require('util').promisify(require('child_process').exec);
const version = require('../lerna.json').version;

let from, to, compact;

const keyName = {
  bfp: ':rotating_light:　[Warranty Fixes](https://vaadin.com/support/for-business#warranty)',
  break: ':boom:　Breaking Changes',
  feat: ':rocket:　New Features',
  fix: ':bug:　Bug Fixes',
  refactor: ':nail_care:　Polish',
  docs: ':memo:　Documentation',
  test: ':microscope:　Tests',
  chore: ':house:　Internal'
};

async function run(cmd) {
  const { stdout } = await exec(cmd, { maxBuffer: 5000 * 1024 });
  return stdout.trim();
}

// Compute tags used for commit delimiters
async function getReleases() {
  for (let i = 2; process.argv[i]; i++) {
    switch (process.argv[i]) {
      case '--from':
        i += 1;
        from = process.argv[i];
        break;
      case '--to':
        i += 1;
        to = process.argv[i];
        break;
      case '--compact':
        compact = true;
        break;
      default:
        break;
    }
  }

  if (!from) {
    const branch = await run(`git rev-parse --abbrev-ref HEAD`);
    await run(`git pull origin ${branch} --tags`);
    const tags = await run(`git tag --merged ${branch} --sort='-*committerdate'`);
    from = tags.split('\n')[1];
  }

  if (!to) {
    to = `v${version}`;
  }
}

// Parse git log string and return an array of parsed commits as a JS object.
function parseLog(log) {
  const commits = [];
  let commit, pos, result;
  log.split('\n').forEach((line) => {
    switch (pos) {
      case 'head':
        if (!line.trim()) {
          pos = 'title';
          break;
        }
        result = /^(\w+): +(.+)$/.exec(line);
        if (result) {
          commit.head[result[1]] = result[2];
          break;
        }
        break;
      case 'title':
        if (!line.trim()) {
          pos = 'body';
          break;
        }
        result = /^ +(\w+)(!?): +(.*)$/.exec(line);
        if (result) {
          commit.type = result[1].toLowerCase();
          commit.breaking = !!result[2];
          commit.isBreaking = commit.breaking;
          commit.skip = !commit.breaking && !/(feat|fix|perf)/.test(commit.type);
          commit.isIncluded = !commit.skip;
          commit.title += result[3];
        } else {
          commit.title += line;
        }
        break;
      case 'body':
        result = /^ +([A-Z][\w-]+): +(.*)$/.exec(line);
        if (result) {
          const k = result[1].toLowerCase();
          if (k === 'warranty') {
            commit.bfp = true;
          }
          if (/(fixes|fix|related-to|connected-to|warranty)/i.test(k)) {
            commit.footers.fixes = commit.footers.fixes || [];
            commit.footers.fixes.push(...result[2].split(/[, ]+/).filter((s) => /\d+/.test(s)));
          } else {
            commit.footers[k] = commit.footers[k] || [];
            commit.footers[k].push(result[2]);
          }
          break;
        }
      // eslint-disable-next-line no-fallthrough
      default:
        result = /^commit (.+)$/.exec(line);
        if (result) {
          if (commit) {
            commit.body = commit.body.trim();
          }
          commit = {
            head: {},
            title: '',
            body: '',
            isIncluded: false,
            isBreaking: false,
            components: [],
            footers: { fixes: [] },
            commits: []
          };
          commits.push(commit);
          commit.commit = result[1];
          pos = 'head';
        } else if (line.startsWith(' ')) {
          commit.body = String(commit.body);
        } else if (/^packages\/.*/.test(line)) {
          const wc = line.split('/')[1];
          if (!commit.components.includes(wc)) {
            commit.components.push(wc);
          }
        }
    }
  });
  return commits;
}

// return absolute link to GH given a path
function createGHLink(path) {
  return `https://github.com/vaadin/${path}`;
}

// create link to low-components repo given a type or id
function createLink(type, id, char) {
  return id ? `[${char ? char : id}](${createGHLink(`web-components/${type}/${id})`)}` : '';
}

// convert GH internal links to absolute links
function parseLinks(message) {
  message = message.trim();
  message = message.replace(/^([\da-f]+) /, `${createLink('commit', '$1', '⧉')} `);
  message = message.replace(/ *\(#(\d+)\)$/g, ` (${createLink('pull', '$1', '#$1')})`);
  return message;
}

// return web-components affected by this commit
function getComponents(c) {
  if (c.components[0]) {
    return `- ${c.components.map((k) => '`' + k + '`').join(', ')}`;
  }
}

// return ticket links for this commit
function getTickets(c) {
  if (c.footers.fixes && c.footers.fixes[0]) {
    const ticket = `Ticket${c.footers.fixes.length > 1 ? 's' : ''}`;
    const links = c.footers.fixes.reduce((prev, f) => {
      let link = f;
      if (/^#?\d/.test(f)) {
        f = f.replace(/^#/, '');
        link = `${createLink('issues', f)}`;
      } else if (/^(vaadin\/|https:\/\/github.com\/vaadin\/).*\d+$/.test(f)) {
        const n = f.replace(/^.*?(\d+)$/, '$1');
        f = f.replace(/^(https:\/\/github.com\/vaadin|vaadin)\//, '').replace('#', '/issues/');
        link = `[${n}](${createGHLink(f)})`;
      }
      return (prev ? `${prev}, ` : '') + link;
    }, '');
    return `**${ticket}:**${links}`;
  }
}

// log a commit for release notes
function logCommit(c) {
  let log = '';
  let indent = '';
  if (!compact) {
    const components = getComponents(c);
    if (components) {
      log += `${components}\n`;
    }
    indent = '  ';
  }
  log += `${indent}- ` + parseLinks(c.commit.substring(0, 7) + ' ' + c.title[0].toUpperCase() + c.title.slice(1));
  const tickets = getTickets(c);
  if (tickets) {
    log += `. ${tickets}`;
  }
  if (c.body) {
    log += `\n\n        _${c.body}_`;
  }
  console.log(log);
}

// log a set of commits, and group by types
function logCommitsByType(commits) {
  if (!commits[0]) {
    return;
  }
  const byType = {};
  commits.forEach((commit) => {
    const type = commit.bfp ? 'bfp' : commit.breaking ? 'break' : commit.type;
    byType[type] = [...(byType[type] || []), commit];
  });

  Object.keys(keyName).forEach((k) => {
    if (byType[k]) {
      console.log(`\n#### ${keyName[k]}`);

      if (compact) {
        byType[k].forEach((c) => logCommit(c));
      } else {
        logCommitsByComponent(byType[k].filter((c) => c.components.length));

        const other = byType[k].filter((c) => !c.components.length);
        if (other.length) {
          console.log('- Other');
          other.forEach((c) => logCommit(c));
        }
      }
    }
  });
}

function logCommitsByComponent(commits) {
  const byComponent = {};
  commits.forEach((commit) => {
    byComponent[commit.components] = [...(byComponent[commit.components] || []), commit];
  });
  Object.keys(byComponent)
    .sort()
    .forEach((k) => {
      let log = '';
      let indent = '';

      const search = ',';
      const replacement = '`,`';
      const componentsTitle = k.split(search).join(replacement);
      const components = `\`${componentsTitle}\``;

      log += `- ${components}\n`;
      indent = '  ';
      let lineBrake = 0;
      byComponent[k].forEach((c) => {
        lineBrake += 1;
        if (lineBrake > 1) {
          log += `\n`;
        }
        log += `${indent}- ` + parseLinks(c.commit.substring(0, 7) + ' ' + c.title[0].toUpperCase() + c.title.slice(1));
        const tickets = getTickets(c);
        if (tickets) {
          log += `. ${tickets}`;
        }
      });
      console.log(log.replace(/^\s*[\r\n]/gm, ''));
    });
}

// Output the release notes for the set of commits
function generateReleaseNotes(commits) {
  console.log(`${to}\n`);
  console.log(`[API Documentation →](https://cdn.vaadin.com/vaadin-web-components/${version}/)\n`);
  if (commits.length) {
    console.log(`### Changes Since [${from}](https://github.com/vaadin/web-components/releases/tag/${from})`);
  } else {
    console.log(`### No Changes Since [${from}](https://github.com/vaadin/web-components/releases/tag/${from})})`);
  }
  logCommitsByType(commits);
}

// MAIN
async function main() {
  await getReleases();
  const gitLog = await run(`git log ${from}..${to} --name-only`);
  const commits = parseLog(gitLog);
  generateReleaseNotes(commits);
}

main();
