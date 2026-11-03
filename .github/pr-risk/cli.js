/**
 * Classifies a pull request from the command line the way the PR risk workflow
 * does, without changing the pull request. Prints the comment that the
 * workflow would post and the label that it would set.
 *
 *   node .github/pr-risk/cli.js https://github.com/vaadin/web-components/pull/13345
 *
 * Reads GitHub with GH_TOKEN or GITHUB_TOKEN when set; public repositories
 * also work without, at a lower rate limit. Claude assesses the pull request
 * when ANTHROPIC_API_KEY is set, OpenAI when only OPENAI_API_KEY is set (with
 * the model in OPENAI_MODEL, if set). Either needs the SDKs (`npm ci` in this
 * directory). Without a key, the label comes from the policy alone, as in a
 * workflow run whose assessment failed.
 */
import { providerPackage } from './assess.js';
import { LABELS, run } from './main.js';

const USAGE = 'Usage: node .github/pr-risk/cli.js https://github.com/<owner>/<repo>/pull/<number>';

const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

function parsePullRequest(arg = '') {
  const match = /^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+)\/pull\/(\d+)/u.exec(arg);
  return match && { owner: match[1], repo: match[2], number: Number(match[3]) };
}

async function request(path) {
  const response = await fetch(`https://api.github.com/${path}`, {
    headers: { accept: 'application/vnd.github+json', ...(token && { authorization: `Bearer ${token}` }) },
  });
  if (!response.ok && response.status !== 404) {
    throw new Error(`GET ${path} failed: ${response.status} ${response.statusText}`);
  }
  return response;
}

async function listFiles({ owner, repo, pull_number }) {
  const files = [];
  // The endpoint lists at most 3000 files, 100 per page
  for (let page = 1; page <= 30; page++) {
    const response = await request(`repos/${owner}/${repo}/pulls/${pull_number}/files?per_page=100&page=${page}`);
    const batch = await response.json();
    files.push(...batch);
    if (batch.length < 100) {
      break;
    }
  }
  return files;
}

async function isMember(owner, login) {
  // 204 for members; 404, or a redirect to the public members, otherwise
  const response = await request(`orgs/${owner}/members/${login}`);
  return response.status === 204;
}

/** Reads from the GitHub API like the workflow's client, and records the writes instead of making them */
function createDryRunGithub(writes) {
  const record = (name) => (params) => {
    writes.push({ name, params });
    return Promise.resolve({ data: {} });
  };
  return {
    rest: {
      pulls: {
        get: async ({ owner, repo, pull_number }) => {
          const response = await request(`repos/${owner}/${repo}/pulls/${pull_number}`);
          if (response.status === 404) {
            throw new Error(`${owner}/${repo}#${pull_number} not found`);
          }
          // The workflow skips closed and draft pull requests, the command line classifies them too
          return { data: { ...(await response.json()), state: 'open', draft: false } };
        },
        listFiles,
      },
      issues: {
        // An existing comment only decides between creating and updating it
        listComments: () => [],
        createLabel: record('createLabel'),
        addLabels: record('addLabels'),
        removeLabel: record('removeLabel'),
        createComment: record('createComment'),
        updateComment: record('updateComment'),
      },
    },
    paginate: (endpoint, params) => Promise.resolve(endpoint(params)),
  };
}

function createCore(outputs, notes) {
  return {
    summary: { addRaw: () => ({ write: () => Promise.resolve() }) },
    setOutput: (name, value) => {
      outputs[name] = value;
    },
    notice: (message) => notes.push(message),
    setFailed: (message) => notes.push(message),
  };
}

async function main() {
  const pullRequest = parsePullRequest(process.argv[2]);
  if (!pullRequest) {
    console.error(USAGE);
    process.exitCode = 2;
    return;
  }

  const sdk = providerPackage(process.env);
  if (sdk) {
    try {
      await import(sdk);
    } catch {
      console.error(`${sdk} is missing. Run \`npm ci\` in .github/pr-risk first.`);
      process.exitCode = 1;
      return;
    }
  }

  const { owner, repo, number } = pullRequest;
  const pr = await (await request(`repos/${owner}/${repo}/pulls/${number}`)).json();
  if (!pr.user) {
    console.error(`${owner}/${repo}#${number} not found`);
    process.exitCode = 1;
    return;
  }
  const writes = [];
  const outputs = {};
  const notes = [];
  await run({
    github: createDryRunGithub(writes),
    context: {
      repo: { owner, repo },
      payload: { pull_request: { number } },
      serverUrl: 'https://github.com',
      runId: 'local',
    },
    core: createCore(outputs, notes),
    env: { ...process.env, AUTHOR_IS_MEMBER: String(await isMember(owner, pr.user.login)) },
  });

  const comment = writes.find(({ name }) => name === 'createComment');
  if (comment) {
    console.log(comment.params.body);
  }
  if (pr.state !== 'open' || pr.draft) {
    notes.push(`#${number} is ${pr.draft ? 'a draft' : pr.state}, so the workflow would not classify it now`);
  }
  for (const note of notes) {
    console.error(`Note: ${note}`);
  }
  if (outputs.category) {
    console.log(`Label: ${LABELS[outputs.category].name}`);
  }
}

await main();
