/**
 * Pure functions of the PR risk workflow: evaluate the repository policy,
 * build the diff that Claude reads, combine the policy with Claude's
 * assessment into the final category, and render the PR comment.
 */
import { matchesGlob } from 'node:path';
import { BREAKING_TITLE, CONTENT_RULES, PATH_RULES, TRUSTED_ASSOCIATIONS } from './policy.js';

/** From lowest to highest risk */
export const CATEGORIES = ['green', 'amber', 'red'];

export const DIMENSIONS = [
  { key: 'impact', title: 'Impact' },
  { key: 'blast_radius', title: 'Blast radius' },
  { key: 'uncertainty', title: 'Uncertainty' },
  { key: 'reversibility', title: 'Reversibility' },
];

const CATEGORY_TEXT = {
  green: { icon: '🟢', requirement: 'Can merge without human approval once CI and the agent review pass.' },
  amber: { icon: '🟡', requirement: 'Needs approval from one human code owner.' },
  red: {
    icon: '🔴',
    requirement: 'Needs expert review. A human owns the design decision and is accountable for the release.',
  },
};

const LEVEL_ICONS = { low: '🟢', medium: '🟡', high: '🔴' };

/** Characters of diff that Claude reads, about 100k tokens */
export const DIFF_BUDGET = 400_000;

/** The pull request files endpoint lists at most this many files */
const MAX_LISTED_FILES = 3000;

/** Files without a text diff, the GitHub API sends no patch for them */
const BINARY_FILE = /\.(?:png|jpe?g|gif|webp|ico|woff2?|ttf|otf|eot|pdf|zip|gz)$/iu;

/** Lockfiles go last in the diff, so that their size does not crowd out the code */
const LOCKFILE = /(?:^|\/)(?:yarn\.lock|package-lock\.json)$/u;

/** A blank line or a line that only holds a comment (`//`, `/*`, `*`, `<!--`) */
const COMMENT_LINE = /^\s*(?:$|\/\/|\/\*|\*|<!--)/u;

const MAX_LISTED_FINDING_FILES = 10;

export function maxCategory(a, b) {
  return CATEGORIES.indexOf(a) >= CATEGORIES.indexOf(b) ? a : b;
}

/** The added and removed lines of a unified diff patch, without the hunk headers */
export function changedLines(patch = '') {
  const added = [];
  const removed = [];
  for (const line of patch.split('\n')) {
    if (line.startsWith('+')) {
      added.push(line.slice(1));
    } else if (line.startsWith('-')) {
      removed.push(line.slice(1));
    }
  }
  return { added, removed };
}

function paths(file) {
  return file.previous_filename ? [file.filename, file.previous_filename] : [file.filename];
}

function matchesAny(file, globs) {
  return paths(file).some((path) => globs.some((glob) => matchesGlob(path, glob)));
}

/** Whether the file changes more than comments and blank lines. A file without a patch counts as code. */
function changesCode(file) {
  if (!file.patch) {
    return true;
  }
  const { added, removed } = changedLines(file.patch);
  return [...added, ...removed].some((line) => !COMMENT_LINE.test(line));
}

function addedCode(file) {
  return changedLines(file.patch).added.filter((line) => !COMMENT_LINE.test(line));
}

/**
 * The rules of the repository policy that match a pull request, each with the
 * minimum category it sets and the files that made it match.
 */
export function evaluatePolicy({ title, authorTrusted, files }) {
  const findings = [];

  for (const rule of PATH_RULES) {
    const matched = files.filter((file) => matchesAny(file, rule.paths) && (!rule.codeOnly || changesCode(file)));
    if (matched.length > 0) {
      findings.push({ category: rule.category, reason: rule.reason, files: matched.map((file) => file.filename) });
    }
  }

  for (const rule of CONTENT_RULES) {
    const matched = files.filter(
      (file) => matchesAny(file, rule.paths) && addedCode(file).some((line) => rule.pattern.test(line)),
    );
    if (matched.length > 0) {
      findings.push({
        category: rule.category,
        reason: `adds ${rule.reason}`,
        files: matched.map((file) => file.filename),
      });
    }
  }

  if (BREAKING_TITLE.test(title)) {
    findings.push({ category: 'red', reason: 'breaking change (`!` in the title)', files: [] });
  }

  if (!authorTrusted) {
    findings.push({ category: 'amber', reason: 'the author is not a member of the organization', files: [] });
  }

  return findings;
}

export function isTrustedAuthor({ authorAssociation, isMember }) {
  return isMember || TRUSTED_ASSOCIATIONS.includes(authorAssociation);
}

function diffHeader(file) {
  const before = file.status === 'added' ? '/dev/null' : `a/${file.previous_filename ?? file.filename}`;
  const after = file.status === 'removed' ? '/dev/null' : `b/${file.filename}`;
  return `diff --git a/${file.previous_filename ?? file.filename} b/${file.filename}\n--- ${before}\n+++ ${after}`;
}

/**
 * The unified diff that Claude reads, within the character budget. `omitted`
 * lists the text files that changed but whose diff is not in `text`, because
 * the API sent no patch for them or the budget ran out.
 */
export function buildDiff(files, budget = DIFF_BUDGET) {
  const ordered = [
    ...files.filter((file) => !LOCKFILE.test(file.filename)),
    ...files.filter((file) => LOCKFILE.test(file.filename)),
  ];
  const parts = [];
  const omitted = [];
  let size = 0;

  for (const file of ordered) {
    if (!file.patch) {
      if (file.changes > 0 && !BINARY_FILE.test(file.filename)) {
        omitted.push(file.filename);
      }
      continue;
    }
    const part = `${diffHeader(file)}\n${file.patch}`;
    if (size + part.length > budget) {
      omitted.push(file.filename);
      continue;
    }
    parts.push(part);
    size += part.length;
  }

  if (files.length >= MAX_LISTED_FILES) {
    omitted.push(`files after the first ${MAX_LISTED_FILES}`);
  }

  return { text: parts.join('\n'), omitted };
}

/**
 * The final category of a pull request: the highest of Claude's suggestion and
 * the minimum categories that the policy findings set. Without an assessment,
 * or when Claude did not see the whole diff, the pull request needs at least
 * one human approval.
 */
export function classify({ policyFindings, omitted, assessment }) {
  const findings = [...policyFindings];

  if (omitted.length > 0) {
    findings.push({ category: 'amber', reason: 'Claude did not see the whole diff', files: omitted });
  }

  if (!assessment) {
    findings.push({ category: 'amber', reason: 'the Claude assessment is not available', files: [] });
  } else if (assessment.category === 'green' && DIMENSIONS.some(({ key }) => assessment[key].level !== 'low')) {
    findings.push({ category: 'amber', reason: 'Claude suggested green but rated a dimension above low', files: [] });
  }

  const category = findings.map((finding) => finding.category).reduce(maxCategory, assessment?.category ?? 'green');
  return { category, findings };
}

/** Model output is steered by the pull request, so keep it from pinging users or breaking the table */
function text(value) {
  return String(value)
    .replace(/\s*\n\s*/gu, ' ')
    .replace(/@(?=[\w-])/gu, '@\u200b')
    .trim();
}

function cell(value) {
  return text(value).replace(/\|/gu, '\\|');
}

function renderFinding({ category, reason, files }) {
  const lines = [`- ${CATEGORY_TEXT[category].icon} **${category}**: ${reason}`];
  for (const file of files.slice(0, MAX_LISTED_FINDING_FILES)) {
    lines.push(`  - \`${file}\``);
  }
  if (files.length > MAX_LISTED_FINDING_FILES) {
    lines.push(`  - and ${files.length - MAX_LISTED_FINDING_FILES} more`);
  }
  return lines;
}

/** The PR comment that explains the label. Starts with `marker`, which finds the comment again. */
export function renderComment({ marker, result, assessment, headSha, runUrl }) {
  const { category, findings } = result;
  const lines = [
    marker,
    `### ${CATEGORY_TEXT[category].icon} PR risk: ${category}`,
    '',
    CATEGORY_TEXT[category].requirement,
    '',
  ];

  if (assessment) {
    const raised = category !== assessment.category ? ` The rules below raised it to **${category}**.` : '';
    lines.push(`Claude suggested **${assessment.category}**.${raised} ${text(assessment.summary)}`, '');
    lines.push('| Dimension | Risk | Reason |', '| --- | --- | --- |');
    for (const { key, title } of DIMENSIONS) {
      const { level, reason } = assessment[key];
      lines.push(`| ${title} | ${LEVEL_ICONS[level]} ${level} | ${cell(reason)} |`);
    }
    lines.push('', `> ${text(assessment.rationale)}`, '');
  } else {
    lines.push(`The Claude assessment failed, see the [workflow run](${runUrl}).`, '');
  }

  if (findings.length > 0) {
    lines.push('**Minimum category rules**', '');
    for (const finding of [...findings].sort(
      (a, b) => CATEGORIES.indexOf(b.category) - CATEGORIES.indexOf(a.category),
    )) {
      lines.push(...renderFinding(finding));
    }
    lines.push('');
  }

  lines.push(
    `<sub>Classified at ${headSha.slice(0, 10)} by the [PR risk workflow](${runUrl}). Every push classifies the pull request again.</sub>`,
    '',
  );
  return lines.join('\n');
}
