import assert from 'node:assert/strict';
import { beforeEach, describe, test } from 'node:test';
import { MARKER, run } from '../main.js';

function rating(level) {
  return { level, reason: `rated ${level}` };
}

const GREEN = {
  summary: 'Fixes a typo.',
  impact: rating('low'),
  blast_radius: rating('low'),
  uncertainty: rating('low'),
  reversibility: rating('low'),
  category: 'green',
  rationale: 'A documentation fix.',
};

/** A fake GitHub client that records the calls that change the pull request */
function createGithub({ pr, files, comments = [] }) {
  const calls = [];
  const record = (name) => (params) => {
    calls.push([name, params]);
    return Promise.resolve({ data: {} });
  };
  const github = {
    calls,
    rest: {
      pulls: {
        get: () => Promise.resolve({ data: pr }),
        listFiles: 'listFiles',
      },
      issues: {
        listComments: 'listComments',
        createLabel: record('createLabel'),
        addLabels: record('addLabels'),
        removeLabel: record('removeLabel'),
        createComment: record('createComment'),
        updateComment: record('updateComment'),
      },
    },
    paginate: (endpoint) => Promise.resolve(endpoint === 'listFiles' ? files : comments),
  };
  return github;
}

function createCore() {
  const core = {
    failed: null,
    outputs: {},
    notices: [],
    summary: { addRaw: () => ({ write: () => Promise.resolve() }) },
    setFailed: (message) => {
      core.failed = message;
    },
    setOutput: (name, value) => {
      core.outputs[name] = value;
    },
    notice: (message) => core.notices.push(message),
  };
  return core;
}

const context = {
  repo: { owner: 'vaadin', repo: 'web-components' },
  payload: { pull_request: { number: 42 } },
  serverUrl: 'https://github.com',
  runId: 7,
};

const env = { ANTHROPIC_API_KEY: 'key', AUTHOR_IS_MEMBER: 'true' };

describe('run', () => {
  let pr;

  beforeEach(() => {
    pr = {
      number: 42,
      state: 'open',
      draft: false,
      title: 'docs: fix typo',
      body: '',
      author_association: 'CONTRIBUTOR',
      head: { sha: 'abcdef0123456789' },
      labels: [{ name: 'risk: red' }, { name: 'a11y' }],
    };
  });

  test('replaces the risk label and creates the comment', async () => {
    const files = [{ filename: 'README.md', status: 'modified', changes: 2, patch: '@@\n-teh\n+the' }];
    const github = createGithub({ pr, files });
    const core = createCore();
    await run({ github, context, core, env, assess: () => Promise.resolve(GREEN) });

    assert.deepEqual(
      github.calls.map(([name]) => name),
      ['createLabel', 'addLabels', 'removeLabel', 'createComment'],
    );
    assert.deepEqual(github.calls[1][1].labels, ['risk: green']);
    assert.equal(github.calls[2][1].name, 'risk: red');
    assert.ok(github.calls[3][1].body.startsWith(MARKER));
    assert.equal(core.outputs.category, 'green');
    assert.equal(core.failed, null);
  });

  test('updates the comment of an earlier run and keeps a label that is still right', async () => {
    pr.labels = [{ name: 'risk: red' }];
    const files = [{ filename: '.github/workflows/verify.yml', status: 'modified', changes: 2, patch: '@@\n-a\n+b' }];
    const comments = [
      { id: 1, user: { login: 'someone' }, body: MARKER },
      { id: 2, user: { login: 'github-actions[bot]' }, body: `${MARKER}\nold` },
    ];
    const github = createGithub({ pr, files, comments });
    await run({ github, context, core: createCore(), env, assess: () => Promise.resolve(GREEN) });

    assert.deepEqual(
      github.calls.map(([name]) => name),
      ['updateComment'],
    );
    assert.equal(github.calls[0][1].comment_id, 2);
  });

  test('labels by the policy alone and fails the run when the assessment fails', async () => {
    const files = [{ filename: 'README.md', status: 'modified', changes: 2, patch: '@@\n-teh\n+the' }];
    const github = createGithub({ pr, files });
    const core = createCore();
    await run({
      github,
      context,
      core,
      env,
      assess: () => Promise.reject(new Error('overloaded')),
    });

    assert.deepEqual(github.calls[1][1].labels, ['risk: amber']);
    assert.equal(core.failed, 'The agent assessment failed: overloaded');
  });

  test('skips draft pull requests', async () => {
    pr.draft = true;
    const github = createGithub({ pr, files: [] });
    const core = createCore();
    await run({ github, context, core, env, assess: () => Promise.resolve(GREEN) });

    assert.deepEqual(github.calls, []);
    assert.equal(core.notices.length, 1);
  });
});
