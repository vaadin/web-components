/**
 * Pure helpers of `scripts/cem-api.js`: project the manifests to text API
 * snapshots, count and render the differences, and build the PR comment.
 *
 * Each element is a header line with its tag name, followed by one indented
 * line per public item. As the tag name starts with a letter, git's default
 * funcname heuristic puts it in the header of every hunk of a snapshot diff.
 */
import { byName, getElements } from './cem-helpers.js';

export const COMMENT_MARKER = '<!-- cem-api -->';

// GitHub comments are limited to 65536 characters
const MAX_DIFF_LENGTH = 60000;
// Below this, a cut diff shows too little to be useful
const MIN_DIFF_LENGTH = 2000;
const ARTIFACT_POINTER = 'see the `cem-api-report` artifact.';

const KIND_ORDER = [
  'attribute',
  'property',
  'static-property',
  'method',
  'static-method',
  'event',
  'slot',
  'part',
  'state',
  'cssprop',
];

const oneLine = (text) => String(text).replace(/\s+/gu, ' ').trim();
const isPublic = (item) => item.privacy !== 'private' && item.privacy !== 'protected';

function line(kind, name, detail = '', flags = []) {
  const suffix = flags.filter(Boolean).map((flag) => ` [${flag}]`);
  return { kind, name, text: `  ${kind} ${name}${detail}${suffix.join('')}` };
}

function typeDetail(item) {
  return item.type?.text ? `: ${oneLine(item.type.text)}` : '';
}

function signature(method) {
  const params = (method.parameters || [])
    .map((p) => `${p.rest ? '...' : ''}${p.name}${p.optional ? '?' : ''}${p.type ? `: ${oneLine(p.type.text)}` : ''}`)
    .join(', ');
  const ret = method.return?.type?.text;
  return `(${params})${ret ? `: ${oneLine(ret)}` : ''}`;
}

function renderBlocks(blocks) {
  return `${blocks
    .sort((a, b) => byName(a.header, b.header))
    .map(({ header, lines }) =>
      [
        header,
        ...lines
          .sort(
            (a, b) =>
              KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind) ||
              byName(a.name, b.name) ||
              byName(a.text, b.text),
          )
          .map((l) => l.text),
      ].join('\n'),
    )
    .join('\n\n')}\n`;
}

/**
 * @param {object} manifest the root `custom-elements.json`
 * @return {string} the public API of every custom element in the manifest
 */
export function snapshotManifest(manifest) {
  const blocks = [];
  for (const decl of getElements(manifest)) {
    const deprecated = (item) => item.deprecated && 'deprecated';
    const lines = [];
    for (const attr of decl.attributes || []) {
      lines.push(line('attribute', attr.name, typeDetail(attr), [deprecated(attr)]));
    }
    for (const member of (decl.members || []).filter(isPublic)) {
      const prefix = member.static ? 'static-' : '';
      if (member.kind === 'field') {
        lines.push(
          line(`${prefix}property`, member.name, typeDetail(member), [
            member.attribute && `attribute=${member.attribute}`,
            member.reflects && 'reflects',
            member.readonly && 'readonly',
            deprecated(member),
          ]),
        );
      } else if (member.kind === 'method') {
        lines.push(line(`${prefix}method`, member.name, signature(member), [deprecated(member)]));
      }
    }
    for (const event of (decl.events || []).filter((e) => e.name)) {
      lines.push(line('event', event.name, typeDetail(event), [deprecated(event)]));
    }
    for (const slot of decl.slots || []) {
      lines.push(line('slot', slot.name || '(default)', '', [deprecated(slot)]));
    }
    for (const part of decl.cssParts || []) {
      lines.push(line('part', part.name, '', [deprecated(part)]));
    }
    for (const state of decl.cssStates || []) {
      lines.push(line('state', state.name, '', [deprecated(state)]));
    }
    for (const prop of decl.cssProperties || []) {
      lines.push(
        line('cssprop', prop.name, prop.syntax ? `: ${oneLine(prop.syntax)}` : '', [
          prop.default !== undefined && `default=${oneLine(prop.default)}`,
          deprecated(prop),
        ]),
      );
    }
    const header = `${decl.tagName} (${decl.name})${decl.deprecated ? ' [deprecated]' : ''}`;
    blocks.push({ header, lines });
  }
  return renderBlocks(blocks);
}

/**
 * @param {object[]} files the parsed `web-types.json` files
 * @return {string} the elements of every web-types file
 */
export function snapshotWebTypes(files) {
  const blocks = [];
  for (const data of files) {
    for (const element of data.contributions?.html?.elements || []) {
      const lines = [];
      for (const attr of element.attributes || []) {
        const type = [].concat(attr.value?.type ?? []).join(' | ');
        lines.push(line('attribute', attr.name, type ? `: ${oneLine(type)}` : ''));
      }
      for (const prop of element.js?.properties || []) {
        const type = [].concat(prop.value?.type ?? []).join(' | ');
        lines.push(line('property', prop.name, type ? `: ${oneLine(type)}` : ''));
      }
      for (const event of element.js?.events || []) {
        lines.push(line('event', event.name));
      }
      for (const part of element.css?.parts || []) {
        lines.push(line('part', part.name));
      }
      for (const prop of element.css?.properties || []) {
        lines.push(line('cssprop', prop.name));
      }
      blocks.push({ header: element.name, lines });
    }
  }
  return renderBlocks(blocks);
}

/**
 * @param {string} text an item line without the leading two spaces, e.g. `method focus(options?: FocusOptions): void`
 * @return {string} the key `kind name`, e.g. `method focus`
 */
function itemKey(text) {
  const [kind, word] = text.split(' ');
  // The default slot is named `(default)`, which the cut would empty
  return `${kind} ${word.replace(/[(:].*$/u, '') || word}`;
}

/**
 * @param {string} text a snapshot
 * @return {Map<string, { header: string, items: Map<string, string> }>} the elements by tag name
 */
export function parseSnapshot(text) {
  const elements = new Map();
  let current;
  for (const l of text.split('\n')) {
    if (!l.trim()) {
      continue;
    }
    if (l.startsWith('  ')) {
      current.items.set(itemKey(l.slice(2)), l);
    } else {
      current = { header: l, items: new Map() };
      elements.set(l.split(' ')[0], current);
    }
  }
  return elements;
}

/**
 * @param {ReturnType<typeof parseSnapshot>} base
 * @param {ReturnType<typeof parseSnapshot>} head
 * @return {{ elements: number, removed: number, added: number, changed: number }}
 */
export function diffStats(base, head) {
  const stats = { elements: 0, removed: 0, added: 0, changed: 0 };
  for (const tag of new Set([...base.keys(), ...head.keys()])) {
    const before = base.get(tag);
    const after = head.get(tag);
    const counts = { removed: 0, added: 0, changed: 0 };
    if (!after) {
      counts.removed = before.items.size || 1;
    } else if (!before) {
      counts.added = after.items.size || 1;
    } else {
      counts.changed = before.header === after.header ? 0 : 1;
      for (const [key, text] of before.items) {
        if (!after.items.has(key)) {
          counts.removed += 1;
        } else if (after.items.get(key) !== text) {
          counts.changed += 1;
        }
      }
      for (const key of after.items.keys()) {
        if (!before.items.has(key)) {
          counts.added += 1;
        }
      }
    }
    if (!before || !after || counts.removed || counts.added || counts.changed) {
      stats.elements += 1;
      stats.removed += counts.removed;
      stats.added += counts.added;
      stats.changed += counts.changed;
    }
  }
  return stats;
}

/**
 * Renders a raw `git diff -U0` of two snapshots with one `@@ element @@`
 * header per element, printed only before its first item line.
 * @param {string} raw
 * @return {string}
 */
export function parseDiff(raw) {
  const lines = [];
  let current;
  let printed;
  for (const l of raw.split('\n')) {
    const hunk = l.match(/^@@ [^@]+ @@ ?(.*)$/u);
    if (hunk) {
      current = hunk[1];
    } else if (/^[-+] {2}/u.test(l)) {
      if (printed !== current) {
        lines.push(`@@ ${current} @@`);
        printed = current;
      }
      lines.push(l);
    } else if (/^[-+][^-+]/u.test(l)) {
      // The header of an element added, removed or renamed as a whole names
      // the element of the item lines that follow. Git names the previous
      // element in the hunk funcname then.
      current = l.slice(1);
      printed = current;
      lines.push(l);
    }
  }
  return lines.join('\n');
}

function summary({ elements, removed, added, changed }) {
  const parts = [removed && `${removed} removed`, added && `${added} added`, changed && `${changed} changed`];
  if (!parts.some(Boolean)) {
    return 'no changes';
  }
  return `${parts.filter(Boolean).join(', ')} in ${elements} element${elements === 1 ? '' : 's'}`;
}

/**
 * @return {{ lines: string[], used: number }} the section body and the budget it used
 */
function sectionBody(diff, budget) {
  if (!diff) {
    return { lines: ['No changes.'], used: 0 };
  }
  if (diff.length <= budget) {
    return { lines: ['```diff', diff, '```'], used: diff.length };
  }
  const cut = diff.lastIndexOf('\n', budget);
  if (budget < MIN_DIFF_LENGTH || cut <= 0) {
    return { lines: [`_Diff omitted, ${ARTIFACT_POINTER}_`], used: budget };
  }
  return { lines: ['```diff', diff.slice(0, cut), '```', '', `_Truncated, ${ARTIFACT_POINTER}_`], used: budget };
}

/**
 * @param {{ diff: string, stats: object }} cem the rendered diff and the stats of `custom-elements.api`
 * @param {{ diff: string, stats: object }} webTypes the same for `web-types.api`
 * @param {{ base: string, head: string }} labels
 * @return {string} the body of the PR comment
 */
export function renderComment(cem, webTypes, labels) {
  const comment = [COMMENT_MARKER, '### Custom elements API', '', `Compared ${labels.head} with ${labels.base}.`, ''];
  if (!cem.diff && !webTypes.diff) {
    comment.push('No API changes.');
    return `${comment.join('\n')}\n`;
  }
  let budget = MAX_DIFF_LENGTH;
  for (const [title, { diff, stats }] of [
    ['custom-elements.json', cem],
    ['web-types.json', webTypes],
  ]) {
    const body = sectionBody(diff, budget);
    budget -= body.used;
    comment.push(
      `<details><summary><b>${title} impact</b>: ${summary(stats)}</summary>`,
      '',
      ...body.lines,
      '',
      '</details>',
      '',
    );
  }
  return `${comment.join('\n').trimEnd()}\n`;
}
