/**
 * Entry point of the PR risk workflow, called by actions/github-script with
 * its authenticated `github` client, `context` and `core`. Classifies the pull
 * request of the event, sets one of the risk labels and posts or updates one
 * comment that explains it.
 */
import { assess as defaultAssess } from './assess.js';
import { buildDiff, classify, evaluatePolicy, isTrustedAuthor, renderComment } from './classify.js';

export const MARKER = '<!-- pr-risk -->';

export const LABELS = {
  green: {
    name: 'risk: green',
    color: '0e8a16',
    description: 'Low risk: can merge after CI and the agent review pass',
  },
  amber: { name: 'risk: amber', color: 'fbca04', description: 'Bounded risk: needs one human approval' },
  red: { name: 'risk: red', color: 'b60205', description: 'High risk: needs expert review' },
};

const COMMENT_AUTHOR = 'github-actions[bot]';

async function ensureLabel(github, repo, label) {
  try {
    await github.rest.issues.createLabel({ ...repo, ...label });
  } catch (error) {
    // 422: the label exists already
    if (error.status !== 422) {
      throw error;
    }
  }
}

async function setLabel(github, repo, pr, category) {
  const label = LABELS[category];
  const current = pr.labels.map(({ name }) => name);

  // Add before removing, so that a run that stops halfway leaves a label
  if (!current.includes(label.name)) {
    await ensureLabel(github, repo, label);
    await github.rest.issues.addLabels({ ...repo, issue_number: pr.number, labels: [label.name] });
  }
  for (const { name } of Object.values(LABELS)) {
    if (name !== label.name && current.includes(name)) {
      try {
        await github.rest.issues.removeLabel({ ...repo, issue_number: pr.number, name });
      } catch (error) {
        // 404: someone removed the label meanwhile
        if (error.status !== 404) {
          throw error;
        }
      }
    }
  }
}

async function upsertComment(github, repo, pr, body) {
  const comments = await github.paginate(github.rest.issues.listComments, {
    ...repo,
    issue_number: pr.number,
    per_page: 100,
  });
  const existing = comments.find((comment) => comment.user.login === COMMENT_AUTHOR && comment.body.startsWith(MARKER));
  if (existing) {
    await github.rest.issues.updateComment({ ...repo, comment_id: existing.id, body });
  } else {
    await github.rest.issues.createComment({ ...repo, issue_number: pr.number, body });
  }
}

export async function run({ github, context, core, env = process.env, assess = defaultAssess }) {
  const repo = context.repo;
  const pullNumber = context.payload.pull_request.number;
  const runUrl = `${context.serverUrl}/${repo.owner}/${repo.repo}/actions/runs/${context.runId}`;

  // Read the pull request again: a run that waited in the queue would act on a stale event
  const { data: pr } = await github.rest.pulls.get({ ...repo, pull_number: pullNumber });
  if (pr.state !== 'open' || pr.draft) {
    core.notice(`#${pullNumber} is closed or a draft, skipping`);
    return;
  }

  const files = await github.paginate(github.rest.pulls.listFiles, { ...repo, pull_number: pullNumber, per_page: 100 });
  const authorTrusted = isTrustedAuthor({
    authorAssociation: pr.author_association,
    isMember: env.AUTHOR_IS_MEMBER === 'true',
  });
  const policyFindings = evaluatePolicy({ title: pr.title, authorTrusted, files });
  const diff = buildDiff(files);

  let assessment = null;
  let failure = null;
  if (env.ANTHROPIC_API_KEY) {
    try {
      assessment = await assess({ pr, files, diff });
    } catch (error) {
      failure = `The Claude assessment failed: ${error.message}`;
    }
  } else {
    failure = 'ANTHROPIC_API_KEY is not set, so Claude did not assess the pull request';
  }

  const result = classify({ policyFindings, omitted: diff.omitted, assessment });
  await setLabel(github, repo, pr, result.category);

  const body = renderComment({ marker: MARKER, result, assessment, headSha: pr.head.sha, runUrl });
  await upsertComment(github, repo, pr, body);
  await core.summary.addRaw(body).write();
  core.setOutput('category', result.category);

  // The label is still set from the policy alone, which is never green, but
  // the run fails so that a lost assessment does not go unnoticed
  if (failure) {
    core.setFailed(failure);
  }
}
