import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import {
  COMMENT_MARKER,
  diffStats,
  parseDiff,
  parseSnapshot,
  renderComment,
  snapshotManifest,
  snapshotWebTypes,
} from '../lib/api-snapshot.js';

const manifestOf = (declaration) => ({
  modules: [{ declarations: [{ kind: 'class', customElement: true, tagName: 'vaadin-x', name: 'X', ...declaration }] }],
});

const stats = (base, head) => diffStats(parseSnapshot(base), parseSnapshot(head));

const NO_STATS = { elements: 0, removed: 0, added: 0, changed: 0 };
const LABELS = { base: '`def1234567`', head: '#123 (`abc1234567`)' };

describe('snapshotManifest', () => {
  test('should add styling lines after the JavaScript API', () => {
    const snapshot = snapshotManifest(
      manifestOf({
        attributes: [{ name: 'disabled', type: { text: 'boolean' } }],
        events: [{ name: 'click', type: { text: 'MouseEvent' } }],
        slots: [{ name: 'prefix' }, { name: '' }],
        cssParts: [{ name: 'label' }],
        cssStates: [{ name: 'checked' }, { name: 'active' }],
        cssProperties: [
          { name: '--vaadin-x-gap' },
          { name: '--vaadin-x-background', syntax: '<color>' },
          { name: '--vaadin-x-padding', syntax: '<length>', default: '8px' },
          { name: '--vaadin-x-color', default: 'red' },
        ],
      }),
    );
    assert.equal(
      snapshot,
      [
        'vaadin-x (X)',
        '  attribute disabled: boolean',
        '  event click: MouseEvent',
        '  slot (default)',
        '  slot prefix',
        '  part label',
        '  state active',
        '  state checked',
        '  cssprop --vaadin-x-background: <color>',
        '  cssprop --vaadin-x-color [default=red]',
        '  cssprop --vaadin-x-gap',
        '  cssprop --vaadin-x-padding: <length> [default=8px]',
        '',
      ].join('\n'),
    );
  });

  test('should render public properties and methods with their flags and signatures', () => {
    const snapshot = snapshotManifest(
      manifestOf({
        members: [
          { kind: 'field', name: 'value', type: { text: 'string | null' }, attribute: 'value', reflects: true },
          { kind: 'field', name: 'loading', type: { text: 'boolean' }, attribute: 'loading', readonly: true },
          { kind: 'field', name: 'items', type: { text: 'Item[]' } },
          { kind: 'field', name: 'version', type: { text: 'string' }, static: true },
          {
            kind: 'method',
            name: 'focus',
            parameters: [{ name: 'options', optional: true, type: { text: 'FocusOptions' } }],
            return: { type: { text: 'void' } },
          },
          {
            kind: 'method',
            name: 'scrollToIndex',
            parameters: [{ name: 'indexes', rest: true, type: { text: 'number[]' } }],
          },
          { kind: 'method', name: 'show', static: true, deprecated: true },
          { kind: 'field', name: 'secret', type: { text: 'string' }, privacy: 'private' },
          { kind: 'method', name: 'update', privacy: 'protected' },
        ],
      }),
    );
    assert.equal(
      snapshot,
      [
        'vaadin-x (X)',
        '  property items: Item[]',
        '  property loading: boolean [attribute=loading] [readonly]',
        '  property value: string | null [attribute=value] [reflects]',
        '  static-property version: string',
        '  method focus(options?: FocusOptions): void',
        '  method scrollToIndex(...indexes: number[])',
        '  static-method show() [deprecated]',
        '',
      ].join('\n'),
    );
  });

  test('should flag deprecated styling items', () => {
    const snapshot = snapshotManifest(
      manifestOf({
        slots: [{ name: 'prefix', deprecated: true }],
        cssParts: [{ name: 'label', deprecated: 'Use `content` instead' }],
        cssStates: [{ name: 'active', deprecated: true }],
        cssProperties: [{ name: '--vaadin-x-gap', syntax: '<length>', deprecated: true }],
      }),
    );
    assert.deepEqual(snapshot.split('\n').slice(1, 5), [
      '  slot prefix [deprecated]',
      '  part label [deprecated]',
      '  state active [deprecated]',
      '  cssprop --vaadin-x-gap: <length> [deprecated]',
    ]);
  });
});

describe('snapshotWebTypes', () => {
  test('should add part and cssprop lines from css', () => {
    const snapshot = snapshotWebTypes([
      {
        contributions: {
          html: {
            elements: [
              {
                name: 'vaadin-x',
                attributes: [{ name: 'disabled', value: { type: ['boolean', 'null'] } }],
                css: { properties: [{ name: '--vaadin-x-gap' }], parts: [{ name: 'label' }] },
              },
            ],
          },
        },
      },
    ]);
    assert.equal(
      snapshot,
      ['vaadin-x', '  attribute disabled: boolean | null', '  part label', '  cssprop --vaadin-x-gap', ''].join('\n'),
    );
  });

  test('should add no styling lines without css', () => {
    const snapshot = snapshotWebTypes([
      { contributions: { html: { elements: [{ name: 'vaadin-x', js: { events: [{ name: 'opened-changed' }] } }] } } },
    ]);
    assert.equal(snapshot, 'vaadin-x\n  event opened-changed\n');
  });
});

describe('parseSnapshot', () => {
  test('should key the default slot without a trailing space', () => {
    const { items } = parseSnapshot('vaadin-x (X)\n  slot (default)\n  slot prefix [deprecated]\n').get('vaadin-x');
    assert.deepEqual([...items.keys()], ['slot (default)', 'slot prefix']);
  });

  test('should take static-property as the kind', () => {
    const { items } = parseSnapshot('vaadin-x (X)\n  static-property version: string\n').get('vaadin-x');
    assert.deepEqual([...items.keys()], ['static-property version']);
  });

  test('should key items by kind and name', () => {
    const snapshot = [
      'vaadin-x (X)',
      '  property opened: boolean [attribute=opened]',
      '  method open(options?: object): void',
      '  cssprop --vaadin-x-gap: <length> [default=8px]',
      '',
      'vaadin-y (Y)',
    ].join('\n');
    const elements = parseSnapshot(snapshot);
    assert.deepEqual([...elements.keys()], ['vaadin-x', 'vaadin-y']);
    assert.deepEqual(
      [...elements.get('vaadin-x').items.keys()],
      ['property opened', 'method open', 'cssprop --vaadin-x-gap'],
    );
  });
});

describe('diffStats', () => {
  test('should count a renamed CSS property as removed and added', () => {
    assert.deepEqual(
      stats('vaadin-x (X)\n  cssprop --vaadin-x-gap\n', 'vaadin-x (X)\n  cssprop --vaadin-x-spacing\n'),
      {
        elements: 1,
        removed: 1,
        added: 1,
        changed: 0,
      },
    );
  });

  test('should count a changed default as changed', () => {
    assert.deepEqual(
      stats(
        'vaadin-x (X)\n  cssprop --vaadin-x-gap [default=8px]\n',
        'vaadin-x (X)\n  cssprop --vaadin-x-gap [default=4px]\n',
      ),
      { elements: 1, removed: 0, added: 0, changed: 1 },
    );
  });

  test('should count a changed default slot as changed', () => {
    assert.deepEqual(stats('vaadin-x (X)\n  slot (default)\n', 'vaadin-x (X)\n  slot (default) [deprecated]\n'), {
      elements: 1,
      removed: 0,
      added: 0,
      changed: 1,
    });
  });

  test('should count a class rename as changed', () => {
    assert.deepEqual(stats('vaadin-x (A)\n  slot prefix\n', 'vaadin-x (B)\n  slot prefix\n'), {
      elements: 1,
      removed: 0,
      added: 0,
      changed: 1,
    });
  });

  test('should count the items of an added or removed element', () => {
    const base = 'vaadin-a (A)\n  slot prefix\n';
    const head = `${base}\nvaadin-b (B)\n  part label\n  state active\n`;
    assert.deepEqual(stats(base, head), { elements: 1, removed: 0, added: 2, changed: 0 });
    assert.deepEqual(stats(head, base), { elements: 1, removed: 2, added: 0, changed: 0 });
  });

  test('should count an element without items as one added or removed', () => {
    const base = 'vaadin-a (A)\n  slot prefix\n';
    const head = `${base}\nvaadin-b (B)\n`;
    assert.deepEqual(stats(base, head), { elements: 1, removed: 0, added: 1, changed: 0 });
    assert.deepEqual(stats(head, base), { elements: 1, removed: 1, added: 0, changed: 0 });
  });

  test('should count nothing for equal snapshots', () => {
    const snapshot = 'vaadin-x (X)\n  slot prefix\n';
    assert.deepEqual(stats(snapshot, snapshot), NO_STATS);
  });
});

describe('parseDiff', () => {
  test('should not print a header for the previous element of an added element', () => {
    const raw = [
      'diff --git base/custom-elements.api head/custom-elements.api',
      '--- base/custom-elements.api',
      '+++ head/custom-elements.api',
      '@@ -3,0 +4,4 @@ vaadin-a (A)',
      '+vaadin-b (B)',
      '+  part label',
      '+  state active',
      '+',
      '@@ -5 +9 @@ vaadin-c (C)',
      '-  slot prefix',
      '+  slot suffix',
      '',
    ].join('\n');
    assert.equal(
      parseDiff(raw),
      [
        '+vaadin-b (B)',
        '+  part label',
        '+  state active',
        '@@ vaadin-c (C) @@',
        '-  slot prefix',
        '+  slot suffix',
      ].join('\n'),
    );
  });

  test('should not print a header for a hunk with only blank lines', () => {
    const raw = ['@@ -3,0 +4 @@ vaadin-a (A)', '+', '@@ -6 +7 @@ vaadin-b (B)', '-  part label', ''].join('\n');
    assert.equal(parseDiff(raw), '@@ vaadin-b (B) @@\n-  part label');
  });

  test('should print one header for consecutive hunks of an element', () => {
    const raw = ['@@ -2 +2 @@ vaadin-a (A)', '-  part a', '@@ -4 +3 @@ vaadin-a (A)', '-  part b', ''].join('\n');
    assert.equal(parseDiff(raw), '@@ vaadin-a (A) @@\n-  part a\n-  part b');
  });
});

describe('renderComment', () => {
  const cem = { diff: '@@ vaadin-x (X) @@\n+  part label', stats: { elements: 1, removed: 0, added: 1, changed: 0 } };
  const webTypes = { diff: '@@ vaadin-x @@\n-  part label', stats: { elements: 1, removed: 1, added: 0, changed: 0 } };
  const empty = { diff: '', stats: NO_STATS };

  const sections = (comment) => comment.match(/<details>[\s\S]*?<\/details>/gu);

  test('should render two collapsed sections with the counts', () => {
    const comment = renderComment(cem, webTypes, LABELS);
    assert.ok(comment.startsWith(`${COMMENT_MARKER}\n### Custom elements API\n\nCompared #123 (\`abc1234567\`) with`));
    assert.deepEqual(sections(comment), [
      [
        '<details><summary><b>custom-elements.json impact</b>: 1 added in 1 element</summary>',
        '',
        '```diff',
        cem.diff,
        '```',
        '',
        '</details>',
      ].join('\n'),
      [
        '<details><summary><b>web-types.json impact</b>: 1 removed in 1 element</summary>',
        '',
        '```diff',
        webTypes.diff,
        '```',
        '',
        '</details>',
      ].join('\n'),
    ]);
    assert.ok(!comment.includes('<details open'));
  });

  test('should keep an empty section with "No changes."', () => {
    const [, section] = sections(renderComment(cem, empty, LABELS));
    assert.equal(
      section,
      '<details><summary><b>web-types.json impact</b>: no changes</summary>\n\nNo changes.\n\n</details>',
    );
  });

  test('should render "No API changes." without sections for two empty diffs', () => {
    const comment = renderComment(empty, empty, LABELS);
    assert.ok(comment.endsWith('\n\nNo API changes.\n'));
    assert.ok(!comment.includes('<details>'));
  });

  describe('budget', () => {
    const itemLine = `+  property ${'x'.repeat(88)}`;
    const long = (count) => ['@@ vaadin-x (X) @@', ...Array(count).fill(itemLine)].join('\n');
    const longStats = { elements: 1, removed: 0, added: 700, changed: 0 };

    test('should cut a long diff on a line boundary and point to the artifact', () => {
      const comment = renderComment({ diff: long(700), stats: longStats }, empty, LABELS);
      const [section] = sections(comment);
      const fenced = section.match(/```diff\n([\s\S]*)\n```/u)[1];
      assert.ok(fenced.length <= 60000);
      assert.ok(
        fenced
          .split('\n')
          .slice(1)
          .every((l) => l === itemLine),
      );
      assert.ok(section.endsWith('```\n\n_Truncated, see the `cem-api-report` artifact._\n\n</details>'));
    });

    test('should omit the web-types diff when the budget is spent', () => {
      const comment = renderComment({ diff: long(700), stats: longStats }, webTypes, LABELS);
      const [, section] = sections(comment);
      assert.equal(
        section,
        [
          '<details><summary><b>web-types.json impact</b>: 1 removed in 1 element</summary>',
          '',
          '_Diff omitted, see the `cem-api-report` artifact._',
          '',
          '</details>',
        ].join('\n'),
      );
    });

    test('should give the web-types diff the rest of the budget', () => {
      // 570 lines of 101 characters leave more than 2000 characters
      const comment = renderComment({ diff: long(570), stats: longStats }, webTypes, LABELS);
      const [, section] = sections(comment);
      assert.ok(section.includes(`\`\`\`diff\n${webTypes.diff}\n\`\`\``));
    });
  });
});
