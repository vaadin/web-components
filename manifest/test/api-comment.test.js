import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const WORKFLOW = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../.github/workflows/cem-api-comment.yml',
);
const workflow = parse(fs.readFileSync(WORKFLOW, 'utf-8'));
const job = workflow.jobs.comment;
const script = job.steps.find((step) => step.uses?.startsWith('actions/github-script')).with.script;
const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;
const runScript = new AsyncFunction('github', 'context', 'core', 'require', 'process', script);

const MARKER = '<!-- cem-api -->';
const HEAD_SHA = 'abc1234567abc1234567abc1234567abc1234567';
const RUN_URL = 'https://github.com/vaadin/web-components/actions/runs/1';
const BOT = { login: 'github-actions[bot]' };

let cwd;
let tmp;

beforeEach(() => {
  cwd = process.cwd();
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cem-api-comment-'));
});

afterEach(() => {
  process.chdir(cwd);
  fs.rmSync(tmp, { recursive: true, force: true });
});

function writeReport(files) {
  fs.mkdirSync(path.join(tmp, 'report'));
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(tmp, 'report', name), content);
  }
}

const reportFiles = ({ changes = true, body = `${MARKER}\n### Custom elements API\n\nChanged.\n` } = {}) => ({
  'pr-number': '123\n',
  'comment.md': body,
  'status.json': JSON.stringify({ changes }),
});

async function run({ conclusion = 'success', headSha = HEAD_SHA, comments = [] } = {}) {
  const calls = { get: [], list: [], create: [], update: [], failed: [], notice: [] };
  const github = {
    rest: {
      pulls: {
        get: (params) => {
          calls.get.push(params);
          return Promise.resolve({ data: { head: { sha: headSha } } });
        },
      },
      issues: {
        listComments: (params) => {
          calls.list.push(params);
          return Promise.resolve({ data: comments });
        },
        createComment: (params) => {
          calls.create.push(params);
          return Promise.resolve();
        },
        updateComment: (params) => {
          calls.update.push(params);
          return Promise.resolve();
        },
      },
    },
    paginate: async (method, params) => (await method(params)).data,
  };
  const core = {
    setFailed: (message) => calls.failed.push(message),
    notice: (message) => calls.notice.push(message),
  };
  const context = { repo: { owner: 'vaadin', repo: 'web-components' } };
  const env = { HEAD_SHA, CONCLUSION: conclusion, RUN_URL };
  process.chdir(tmp);
  try {
    await runScript(github, context, core, createRequire(import.meta.url), { env });
  } finally {
    process.chdir(cwd);
  }
  return calls;
}

const posted = (calls) => calls.create.length + calls.update.length;

test('the extracted script is not empty and contains the marker', () => {
  assert.ok(script.trim().length > 0);
  assert.ok(script.includes(`const marker = '${MARKER}';`));
});

test('the job condition rejects a cancelled run', () => {
  const condition = job.if;
  // eslint-disable-next-line no-new-func
  const evaluate = new Function('github', `return ${condition.replaceAll(' == ', ' === ')};`);
  // eslint-disable-next-line camelcase
  const event = (conclusion) => ({ event: { workflow_run: { event: 'pull_request', conclusion } } });
  assert.equal(evaluate(event('success')), true);
  assert.equal(evaluate(event('failure')), true);
  assert.equal(evaluate(event('cancelled')), false);
  assert.deepEqual([...condition.matchAll(/conclusion == '(\w+)'/gu)].map((m) => m[1]).sort(), ['failure', 'success']);
});

test('an invalid pull request number fails and posts nothing', async () => {
  writeReport({ ...reportFiles(), 'pr-number': 'abc\n' });
  const calls = await run();
  assert.equal(calls.failed.length, 1);
  assert.equal(calls.get.length, 0);
  assert.equal(posted(calls), 0);
});

test('a head SHA mismatch posts nothing', async () => {
  writeReport(reportFiles());
  const calls = await run({ headSha: 'def4567890def4567890def4567890def4567890' });
  assert.equal(calls.notice.length, 1);
  assert.equal(calls.list.length, 0);
  assert.equal(posted(calls), 0);
});

test('a success with changes and no comment creates one', async () => {
  const files = reportFiles();
  writeReport(files);
  const calls = await run({ comments: [{ id: 1, user: { login: 'someone' }, body: 'LGTM' }] });
  assert.equal(calls.create.length, 1);
  const [{ issue_number: issueNumber, body }] = calls.create;
  assert.equal(issueNumber, 123);
  assert.equal(body, files['comment.md']);
  assert.equal(calls.update.length, 0);
});

test('a success with an existing comment updates it', async () => {
  const files = reportFiles();
  writeReport(files);
  const calls = await run({ comments: [{ id: 7, user: BOT, body: `${MARKER}\nOld` }] });
  assert.equal(calls.update.length, 1);
  const [{ comment_id: id, body }] = calls.update;
  assert.equal(id, 7);
  assert.equal(body, files['comment.md']);
  assert.equal(calls.create.length, 0);
});

test('a success without changes updates an existing comment to "No API changes."', async () => {
  const body = `${MARKER}\n### Custom elements API\n\nNo API changes.\n`;
  writeReport(reportFiles({ changes: false, body }));
  const calls = await run({ comments: [{ id: 7, user: BOT, body: `${MARKER}\nOld` }] });
  assert.equal(calls.update.length, 1);
  const [{ comment_id: id, body: updated }] = calls.update;
  assert.equal(id, 7);
  assert.equal(updated, body);
});

test('a success without changes and without a comment posts nothing', async () => {
  writeReport(reportFiles({ changes: false }));
  const calls = await run();
  assert.equal(calls.list.length, 1);
  assert.equal(posted(calls), 0);
});

test('a marker comment of another user is never updated', async () => {
  writeReport(reportFiles());
  const calls = await run({ comments: [{ id: 7, user: { login: 'someone' }, body: `${MARKER}\nForged` }] });
  assert.equal(calls.update.length, 0);
  assert.equal(calls.create.length, 1);
});

test('a success with a body that lacks the marker posts nothing', async () => {
  writeReport(reportFiles({ body: 'Forged body without the marker' }));
  const calls = await run({ comments: [{ id: 7, user: BOT, body: `${MARKER}\nOld` }] });
  assert.equal(calls.failed.length, 1);
  assert.equal(posted(calls), 0);
});

test('a success with a body over the GitHub limit posts nothing', async () => {
  writeReport(reportFiles({ body: `${MARKER}\n${'x'.repeat(65536)}` }));
  const calls = await run();
  assert.equal(calls.failed.length, 1);
  assert.equal(posted(calls), 0);
});

test('a failure updates an existing comment to the outdated text', async () => {
  writeReport(reportFiles({ body: `${MARKER}\nForged artifact text` }));
  const calls = await run({ conclusion: 'failure', comments: [{ id: 7, user: BOT, body: `${MARKER}\nOld` }] });
  assert.equal(calls.update.length, 1);
  const { comment_id: id, body } = calls.update[0];
  assert.equal(id, 7);
  assert.ok(body.startsWith(MARKER));
  assert.ok(body.includes(HEAD_SHA));
  assert.ok(body.includes(RUN_URL));
  assert.ok(body.includes('outdated'));
  assert.ok(!body.includes('Forged'));
  assert.equal(calls.create.length, 0);
});

test('a failure without a comment posts nothing', async () => {
  writeReport({ 'pr-number': '123\n' });
  const calls = await run({ conclusion: 'failure' });
  assert.equal(calls.failed.length, 0);
  assert.equal(posted(calls), 0);
});

test('a missing report ends with a notice and no API call', async () => {
  const calls = await run();
  assert.equal(calls.notice.length, 1);
  assert.equal(calls.get.length + calls.list.length + posted(calls), 0);
});
