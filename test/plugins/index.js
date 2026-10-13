import { chaiDomDiff } from '@open-wc/semantic-dom-diff';
import { getSnapshot, getSnapshotConfig, saveSnapshot } from '@web/test-runner-commands';
import * as chai from 'chai/index.js';
import sinonChai from 'sinon-chai';
import { getA11yTree } from '@vaadin/test-runner-commands';

// States printed even when `false`, as `false` differs from a missing state.
const A11Y_FALSE_STATES = new Set(['expanded', 'pressed']);

// Snapshots are stored in template literals, which turn escape sequences
// into characters on read, so quote without escaping.
const quote = (text) => `"${text}"`;

const formatText = (text) => (/^[\w$.,!?()•@ ]+$/u.test(text) && !/^\d/u.test(text) ? text : quote(text));

const formatStates = (node) =>
  Object.entries(node.states || {})
    .map(([key, value]) => {
      if (value === true || value === 'true') {
        return key.toLowerCase();
      }
      if (value === false || value === 'false') {
        return A11Y_FALSE_STATES.has(key) ? `${key}=false` : null;
      }
      if (value === '' || (key === 'valuetext' && String(value) === node.value)) {
        return null;
      }
      return `${key.toLowerCase()}=${value}`;
    })
    .filter(Boolean);

/**
 * Removes text that repeats the parent name, such as the label of a button.
 */
const normalizeChildren = (children, parentName) =>
  (children || []).filter((child) => !(child.role === 'text' && child.name === parentName));

/**
 * Converts the tree returned by `getA11yTree()` into the nodes that the
 * snapshot prints: formatted states, descriptions and relations as properties,
 * and a single text child as the inline value.
 */
const toDisplayTree = (nodes) =>
  normalizeChildren(nodes).map((node) => {
    if (node.role === 'text') {
      return { role: 'text', name: node.name };
    }
    let children = normalizeChildren(node.children, node.name);
    let value = node.value;
    if (value === undefined && children.length === 1 && children[0].role === 'text') {
      value = children[0].name;
      children = [];
    }
    const props = [];
    if (node.description) {
      props.push(['description', node.description]);
    }
    Object.entries(node.relations || {}).forEach(([key, targets]) => {
      targets.forEach(({ role, name }) => {
        props.push([key, `${role}${name ? ` ${quote(name)}` : ''}`]);
      });
    });
    return {
      role: node.role,
      name: node.name,
      states: formatStates(node),
      value,
      props,
      children: toDisplayTree(children),
    };
  });

/**
 * Serializes an accessibility tree to YAML in the format of Playwright aria
 * snapshots. Descriptions and relations are printed as `/description` and
 * `/<relation>` properties, like `/url` in Playwright.
 */
const serializeDisplayTree = (nodes, indent = '') =>
  nodes
    .map((node) => {
      if (node.role === 'text') {
        return `${indent}- text: ${formatText(node.name)}`;
      }
      let line = `${indent}- ${node.role}`;
      if (node.name) {
        line += ` ${quote(node.name)}`;
      }
      if (node.states.length) {
        line += ` [${node.states.join(', ')}]`;
      }
      const props = node.props.map(
        ([key, value]) => `${indent}  - /${key}: ${key === 'description' ? formatText(value) : value}`,
      );
      const nested = node.children.length ? serializeDisplayTree(node.children, `${indent}  `) : '';
      if (!props.length && !nested) {
        return node.value === undefined ? line : `${line}: ${formatText(node.value)}`;
      }
      const head = node.value === undefined ? `${line}:` : `${line}:\n${indent}  - /value: ${formatText(node.value)}`;
      return [head, ...props, nested].filter(Boolean).join('\n');
    })
    .join('\n');

const serializeA11yTree = (nodes) => serializeDisplayTree(toDisplayTree(nodes));

const unquote = (text) => (text.length > 1 && text.startsWith('"') && text.endsWith('"') ? text.slice(1, -1) : text);

/**
 * Removes the common indentation and the blank first and last lines of a
 * template literal.
 */
const dedent = (text) => {
  const lines = text.replace(/^\s*\n|\n\s*$/gu, '').split('\n');
  const indent = Math.min(...lines.filter((line) => line.trim()).map((line) => line.match(/^ */u)[0].length));
  return lines.map((line) => line.slice(indent)).join('\n');
};

const NODE_PATTERN = /^(?<role>[\w-]+)(?: "(?<name>[^"]*)")?(?: \[(?<states>[^\]]*)\])?(?::(?: (?<value>.+))?)?$/u;

/**
 * Parses a tree in the snapshot format into display nodes. Values that are
 * not written, such as a missing name, are left undefined and match anything.
 */
const parseDisplayTree = (text) => {
  const root = { children: [] };
  const stack = [{ indent: -1, node: root }];
  dedent(text)
    .split('\n')
    .filter((line) => line.trim())
    .forEach((line) => {
      const indent = line.match(/^ */u)[0].length;
      const content = line.trim().replace(/^- /u, '');
      while (stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }
      const parent = stack[stack.length - 1].node;
      const prop = content.match(/^\/(?<key>[\w-]+): (?<value>.+)$/u);
      if (prop) {
        const { key, value } = prop.groups;
        if (key === 'value') {
          parent.value = unquote(value);
        } else {
          parent.props.push([key, key === 'description' ? unquote(value) : value]);
        }
        return;
      }
      const match = content.match(NODE_PATTERN);
      if (!match) {
        throw new Error(`Cannot parse accessibility tree line: ${line}`);
      }
      const { role, name, states, value } = match.groups;
      const node =
        role === 'text'
          ? { role, name: value === undefined ? undefined : unquote(value) }
          : {
              role,
              name,
              states: states ? states.split(', ') : [],
              value: value === undefined ? undefined : unquote(value),
              props: [],
              children: [],
            };
      parent.children.push(node);
      stack.push({ indent, node });
    });
  return root.children;
};

/**
 * Lists the nodes of a tree in document order, each with the index after its
 * subtree, so that a match can skip the rest of the subtree.
 */
const flattenDisplayTree = (nodes, result = []) => {
  nodes.forEach((node) => {
    const entry = { node, end: 0 };
    result.push(entry);
    flattenDisplayTree(node.children || [], result);
    entry.end = result.length;
  });
  return result;
};

/**
 * Checks that the expected nodes appear in the actual nodes in the same order.
 * Other nodes, states and properties are allowed. With `deep`, an expected node
 * can match an actual node at any depth, which is used for the top level only,
 * so that the expected tree can start below containers.
 */
function matchDisplayList(expected, actual, deep = false) {
  const matchNode = (exp, act) =>
    exp.role === act.role &&
    (exp.name === undefined || exp.name === act.name) &&
    (exp.role === 'text' ||
      ((exp.value === undefined || exp.value === act.value) &&
        exp.states.every((state) => act.states.includes(state)) &&
        exp.props.every(([key, value]) => act.props.some(([k, v]) => k === key && v === value)) &&
        matchDisplayList(exp.children, act.children)));

  const flat = deep ? flattenDisplayTree(actual) : actual.map((node, i) => ({ node, end: i + 1 }));
  let cursor = 0;
  return expected.every((node) => {
    const index = flat.findIndex((entry, i) => i >= cursor && matchNode(node, entry.node));
    if (index === -1) {
      return false;
    }
    cursor = flat[index].end;
    return true;
  });
}

/**
 * Adds `matchA11yTree(expected)`, which checks that the Chromium accessibility
 * tree of an element contains the nodes of the expected tree. The expected tree
 * uses the snapshot format and lists only what the test cares about.
 *
 * @type {Chai.ChaiPlugin}
 */
const chaiA11yTreeMatch = (chai, utils) => {
  /** @this {Chai.AssertionStatic} */
  async function matchA11yTree(expected) {
    const element = utils.flag(this, 'object');
    const actual = toDisplayTree(await getA11yTree(element));
    if (!matchDisplayList(parseDisplayTree(expected), actual, true)) {
      throw new chai.AssertionError(
        'expected accessibility tree to contain the expected nodes',
        { actual: serializeDisplayTree(actual), expected: dedent(expected), showDiff: true },
        utils.flag(this, 'ssfi'),
      );
    }
  }

  utils.addMethod(chai.Assertion.prototype, 'matchA11yTree', matchA11yTree);
};

/**
 * Adds `equalA11yTreeSnapshot()`, which compares the Chromium accessibility
 * tree of an element with the one saved for the current test, and saves it
 * when there is none or when the test runner is called with `--update-snapshots`.
 *
 * @type {Chai.ChaiPlugin}
 */
const chaiA11yTreeSnapshot = (chai, utils) => {
  /** @this {Chai.AssertionStatic} */
  async function equalA11yTreeSnapshot() {
    const element = utils.flag(this, 'object');
    const name = globalThis.__WTR_MOCHA_RUNNER__.test.titlePath().join(' ');
    const snapshot = serializeA11yTree(await getA11yTree(element));
    const currentSnapshot = await getSnapshot({ name });
    const config = await getSnapshotConfig();

    if (currentSnapshot && !config.updateSnapshots) {
      if (currentSnapshot !== snapshot) {
        throw new chai.AssertionError(
          `Accessibility tree snapshot ${name} does not match the saved snapshot on disk`,
          { actual: snapshot, expected: currentSnapshot, showDiff: true },
          utils.flag(this, 'ssfi'),
        );
      }
    } else if (currentSnapshot !== snapshot) {
      await saveSnapshot({ name, content: snapshot });
    }
  }

  utils.addMethod(chai.Assertion.prototype, 'equalA11yTreeSnapshot', equalA11yTreeSnapshot);
};

/**
 * Adds `accessible()`, which runs axe-core rule checks on an element and
 * fails on any violation. Pass `ignoredRules` to skip rules for a test.
 *
 * @type {Chai.ChaiPlugin}
 */
const chaiAxe = (chai, utils) => {
  /** @this {Chai.AssertionStatic} */
  async function accessible({ ignoredRules = [] } = {}) {
    const element = utils.flag(this, 'object');
    // Load axe-core only in tests that use it.
    await import('axe-core/axe.min.js');
    const rules = Object.fromEntries(ignoredRules.map((id) => [id, { enabled: false }]));
    const { violations } = await globalThis.axe.run(element, { rules, resultTypes: ['violations'] });
    const message = violations
      .map(({ id, help, nodes }) => `${id}: ${help}\n${nodes.map((node) => `  ${node.target.join(' ')}`).join('\n')}`)
      .join('\n');
    this.assert(
      violations.length === 0,
      `expected element to have no axe violations, found ${violations.length}:\n${message}`,
      'expected element to have axe violations',
    );
  }

  utils.addMethod(chai.Assertion.prototype, 'accessible', accessible);
};

chai.use(chaiAxe);
chai.use(chaiDomDiff);
chai.use(chaiA11yTreeSnapshot);
chai.use(chaiA11yTreeMatch);
chai.use(sinonChai);

export const { expect } = chai;
