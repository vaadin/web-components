import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { buildDiff, classify, evaluatePolicy, isTrustedAuthor, maxCategory, renderComment } from '../classify.js';

function file(filename, patch, extra = {}) {
  return { filename, status: 'modified', additions: 1, deletions: 1, changes: 2, patch, ...extra };
}

function reasons(findings) {
  return findings.map(({ category, reason }) => `${category}: ${reason}`);
}

function policy(files, { title = 'fix: change something', authorTrusted = true } = {}) {
  return reasons(evaluatePolicy({ title, authorTrusted, files }));
}

function rating(level) {
  return { level, reason: `rated ${level}` };
}

function assessment(category, levels = {}) {
  return {
    summary: 'Changes something.',
    impact: rating(levels.impact ?? 'low'),
    blast_radius: rating(levels.blast_radius ?? 'low'),
    uncertainty: rating(levels.uncertainty ?? 'low'),
    reversibility: rating(levels.reversibility ?? 'low'),
    category,
    rationale: 'Because.',
    model: 'gpt-5.5',
  };
}

describe('evaluatePolicy', () => {
  test('finds nothing for a documentation change by a trusted author', () => {
    assert.deepEqual(policy([file('packages/grid/README.md', '@@ -1 +1 @@\n-teh\n+the')]), []);
  });

  test('sets red for CI workflows', () => {
    assert.deepEqual(policy([file('.github/workflows/verify.yml', '@@ -1 +1 @@\n-a\n+b')]), [
      'red: CI, release and repository automation',
    ]);
  });

  test('matches the previous path of a renamed file', () => {
    const renamed = file('docs/old-ci.yml', undefined, {
      status: 'renamed',
      previous_filename: '.github/workflows/old.yml',
    });
    assert.deepEqual(policy([renamed]), ['red: CI, release and repository automation']);
  });

  test('lists the files that matched a rule', () => {
    const findings = evaluatePolicy({
      title: 'chore: bump',
      authorTrusted: true,
      files: [
        file('package.json', '@@\n-a\n+b'),
        file('packages/grid/package.json', '@@\n-a\n+b'),
        file('README.md', ''),
      ],
    });
    assert.deepEqual(findings, [
      { category: 'amber', reason: 'dependencies', files: ['package.json', 'packages/grid/package.json'] },
    ]);
  });

  test('skips comment-only changes for codeOnly rules', () => {
    const patch = '@@ -1,3 +1,3 @@\n /**\n- * Teh value.\n+ * The value.\n  */\n';
    assert.deepEqual(policy([file('packages/grid/src/vaadin-grid.d.ts', patch)]), []);
  });

  test('applies codeOnly rules to code changes', () => {
    const patch = '@@ -1 +1 @@\n-  value: string;\n+  value: string | null;';
    assert.deepEqual(policy([file('packages/grid/src/vaadin-grid.d.ts', patch)]), ['amber: public TypeScript API']);
  });

  test('applies codeOnly rules to files without a patch', () => {
    assert.deepEqual(policy([file('packages/component-base/src/virtualizer.js', undefined)]), [
      'amber: shared base packages that most components build on',
    ]);
  });

  test('applies the theme rule to Lumo sources but not to its tests', () => {
    const patch = '@@ -1 +1 @@\n-a {}\n+b {}';
    assert.deepEqual(policy([file('packages/vaadin-lumo-styles/lumo.css', patch)]), [
      'amber: themes that every application loads',
    ]);
    assert.deepEqual(policy([file('packages/vaadin-lumo-styles/test/visual/button.test.js', patch)]), []);
  });

  test('sets red for an added HTML sink', () => {
    const patch = '@@ -1 +1,2 @@\n el.textContent = value;\n+el.innerHTML = value;';
    assert.deepEqual(policy([file('packages/grid/src/vaadin-grid-mixin.js', patch)]), [
      'red: adds HTML or script injection sink',
    ]);
  });

  test('ignores clearing the content with innerHTML', () => {
    const patch = "@@ -1 +1,2 @@\n+root.innerHTML = '';\n+if (root.innerHTML === html) {}";
    assert.deepEqual(policy([file('packages/grid/src/vaadin-grid-mixin.js', patch)]), []);
  });

  test('ignores removed lines, comments and tests for content rules', () => {
    const src = '@@ -1,2 +1,2 @@\n-el.innerHTML = value;\n+ * Do not set `el.innerHTML = value` here.';
    const testPatch = '@@ -1 +1 @@\n+fixture.innerHTML = `<vaadin-grid></vaadin-grid>`;';
    assert.deepEqual(
      policy([
        file('packages/grid/src/vaadin-grid-mixin.js', src),
        file('packages/grid/test/basic.test.js', testPatch),
      ]),
      [],
    );
  });

  test('sets red for an added global fetch but not for a fetch method', () => {
    const own = '@@ -1 +1,2 @@\n+this._fetch(page);\n+dataProvider.fetch(params);';
    assert.deepEqual(policy([file('packages/grid/src/vaadin-grid-mixin.js', own)]), []);
    const global = '@@ -1 +1 @@\n+const response = await fetch(this.src);';
    assert.deepEqual(policy([file('packages/icon/src/vaadin-icon-mixin.js', global)]), ['red: adds network requests']);
  });

  test('sets red for added browser storage', () => {
    const patch = "@@ -1 +1 @@\n+localStorage.setItem('state', value);";
    assert.deepEqual(policy([file('packages/grid/src/vaadin-grid-mixin.js', patch)]), [
      'red: adds browser storage or cookies',
    ]);
  });

  test('sets red for a breaking change in the title', () => {
    assert.deepEqual(policy([], { title: 'feat!: remove deprecated API' }), [
      'red: breaking change (`!` in the title)',
    ]);
    assert.deepEqual(policy([], { title: 'refactor(grid)!: rename events' }), [
      'red: breaking change (`!` in the title)',
    ]);
    assert.deepEqual(policy([], { title: 'fix: handle ! in the filter' }), []);
  });

  test('sets amber for an author outside the organization', () => {
    assert.deepEqual(policy([], { authorTrusted: false }), ['amber: the author is not a member of the organization']);
  });
});

describe('isTrustedAuthor', () => {
  test('trusts members by association or membership', () => {
    assert.equal(isTrustedAuthor({ authorAssociation: 'MEMBER', isMember: false }), true);
    assert.equal(isTrustedAuthor({ authorAssociation: 'CONTRIBUTOR', isMember: true }), true);
    assert.equal(isTrustedAuthor({ authorAssociation: 'CONTRIBUTOR', isMember: false }), false);
  });
});

describe('buildDiff', () => {
  test('joins the patches with diff headers', () => {
    const { text, omitted } = buildDiff([
      file('a.js', '@@ -1 +1 @@\n-a\n+b'),
      file('b.js', '@@ -0,0 +1 @@\n+b', { status: 'added' }),
    ]);
    assert.equal(
      text,
      'diff --git a/a.js b/a.js\n--- a/a.js\n+++ b/a.js\n@@ -1 +1 @@\n-a\n+b\n' +
        'diff --git a/b.js b/b.js\n--- /dev/null\n+++ b/b.js\n@@ -0,0 +1 @@\n+b',
    );
    assert.deepEqual(omitted, []);
  });

  test('omits text files without a patch, but not binary files or pure renames', () => {
    const { omitted } = buildDiff([
      file('huge.js', undefined),
      file('screenshot.png', undefined),
      file('moved.js', undefined, { status: 'renamed', previous_filename: 'old.js', changes: 0 }),
    ]);
    assert.deepEqual(omitted, ['huge.js']);
  });

  test('omits the patches over the budget and puts lockfiles last', () => {
    const { text, omitted } = buildDiff(
      [file('yarn.lock', `@@\n+${'x'.repeat(50)}`), file('a.js', '@@\n+a'), file('b.js', `@@\n+${'b'.repeat(50)}`)],
      100,
    );
    assert.match(text, /a\.js/u);
    assert.doesNotMatch(text, /yarn\.lock/u);
    assert.deepEqual(omitted, ['b.js', 'yarn.lock']);
  });
});

describe('classify', () => {
  test('keeps a green suggestion without findings', () => {
    assert.deepEqual(classify({ policyFindings: [], omitted: [], assessment: assessment('green') }), {
      category: 'green',
      findings: [],
    });
  });

  test('raises the suggestion to the highest finding', () => {
    const policyFindings = [
      { category: 'amber', reason: 'dependencies', files: ['package.json'] },
      { category: 'red', reason: 'CI', files: ['.github/x.yml'] },
    ];
    assert.equal(classify({ policyFindings, omitted: [], assessment: assessment('green') }).category, 'red');
  });

  test('keeps a suggestion above the findings', () => {
    const policyFindings = [{ category: 'amber', reason: 'dependencies', files: ['package.json'] }];
    assert.equal(classify({ policyFindings, omitted: [], assessment: assessment('red') }).category, 'red');
  });

  test('sets amber without an assessment', () => {
    const { category, findings } = classify({ policyFindings: [], omitted: [], assessment: null });
    assert.equal(category, 'amber');
    assert.deepEqual(reasons(findings), ['amber: the agent assessment is not available']);
  });

  test('sets amber when the agent did not see the whole diff', () => {
    const { category, findings } = classify({
      policyFindings: [],
      omitted: ['huge.js'],
      assessment: assessment('green'),
    });
    assert.equal(category, 'amber');
    assert.deepEqual(findings, [
      { category: 'amber', reason: 'the agent did not see the whole diff', files: ['huge.js'] },
    ]);
  });

  test('sets amber for a green suggestion with a dimension above low', () => {
    const { category } = classify({
      policyFindings: [],
      omitted: [],
      assessment: assessment('green', { reversibility: 'medium' }),
    });
    assert.equal(category, 'amber');
  });

  test('accepts an amber suggestion with a dimension above low', () => {
    assert.deepEqual(
      classify({ policyFindings: [], omitted: [], assessment: assessment('amber', { impact: 'medium' }) }),
      { category: 'amber', findings: [] },
    );
  });
});

describe('maxCategory', () => {
  test('returns the riskier category', () => {
    assert.equal(maxCategory('green', 'amber'), 'amber');
    assert.equal(maxCategory('red', 'amber'), 'red');
  });
});

describe('renderComment', () => {
  const base = { marker: '<!-- m -->', headSha: '0123456789abcdef', runUrl: 'https://example.com/run' };

  test('explains the category, the ratings and the findings', () => {
    const findings = [{ category: 'red', reason: 'CI', files: ['.github/x.yml'] }];
    const body = renderComment({ ...base, result: { category: 'red', findings }, assessment: assessment('amber') });
    assert.ok(body.startsWith('<!-- m -->\n### 🔴 PR risk: red\n'));
    assert.match(
      body,
      /The agent \(`gpt-5\.5`\) suggested \*\*amber\*\*\. The rules below raised it to \*\*red\*\*\./u,
    );
    assert.match(body, /\| Blast radius \| 🟢 low \| rated low \|/u);
    assert.match(body, /- 🔴 \*\*red\*\*: CI\n {2}- `\.github\/x\.yml`/u);
    assert.match(body, /Classified at 0123456789 /u);
  });

  test('keeps model text from pinging users or breaking the table', () => {
    const steered = assessment('green');
    steered.impact.reason = 'Ping @octocat | and\nbreak';
    const body = renderComment({ ...base, result: { category: 'green', findings: [] }, assessment: steered });
    assert.match(body, /\| Impact \| 🟢 low \| Ping @\u200boctocat \\\| and break \|/u);
  });

  test('links the run when the assessment failed', () => {
    const findings = [{ category: 'amber', reason: 'the agent assessment is not available', files: [] }];
    const body = renderComment({ ...base, result: { category: 'amber', findings }, assessment: null });
    assert.match(body, /The agent assessment failed, see the \[workflow run\]\(https:\/\/example\.com\/run\)\./u);
  });
});
