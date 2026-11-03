/**
 * The repository policy of the PR risk workflow (.github/workflows/pr-risk.yml).
 * Every rule that matches a pull request sets a minimum category for it. Claude
 * can suggest a higher category than the policy, never a lower one.
 *
 * The workflow runs the policy of the base branch, so a pull request that edits
 * this file is classified by the policy it replaces.
 */

/**
 * Rules on the changed files. A rule matches when one of its globs (matched
 * with `path.matchesGlob`) matches the path of a changed file, or the previous
 * path of a renamed file. A rule with `codeOnly` skips files whose changes are
 * only comments and blank lines, so that a JSDoc fix does not need a reviewer.
 */
export const PATH_RULES = [
  {
    category: 'red',
    reason: 'CI, release and repository automation',
    paths: ['.github/**', 'scripts/**', 'lerna.json', 'patches/**'],
  },
  {
    category: 'red',
    reason: 'HTML sanitization',
    paths: ['packages/markdown/src/**', 'packages/rich-text-editor/src/**'],
  },
  {
    category: 'red',
    reason: 'authentication UI',
    paths: ['packages/login/src/**'],
  },
  {
    category: 'red',
    reason: 'file uploads to the server',
    paths: ['packages/upload/src/vaadin-upload-mixin.js', 'packages/upload/src/vaadin-upload-*manager.js'],
  },
  {
    category: 'red',
    reason: 'usage statistics',
    paths: ['packages/component-base/src/element-mixin.js'],
  },
  {
    category: 'amber',
    reason: 'dependencies',
    paths: ['**/package.json', 'yarn.lock'],
  },
  {
    category: 'amber',
    reason: 'instructions that agents follow, including the agent review',
    paths: ['CLAUDE.md', '**/AGENTS.md', '.claude/**', 'CONVENTIONS.md', 'guidelines/**'],
  },
  {
    category: 'amber',
    reason: 'test, lint and build tooling that CI relies on',
    paths: [
      '*.config.js',
      'wtr-utils.js',
      'wds-utils.js',
      'tsconfig.json',
      'custom-rules/**',
      'manifest/**',
      'react/scripts/**',
    ],
  },
  {
    category: 'amber',
    reason: 'shared base packages that most components build on',
    paths: [
      'packages/component-base/src/**',
      'packages/a11y-base/src/**',
      'packages/field-base/src/**',
      'packages/overlay/src/**',
      'packages/vaadin-themable-mixin/*.js',
    ],
    codeOnly: true,
  },
  {
    category: 'amber',
    reason: 'themes that every application loads',
    paths: [
      'packages/aura/*.css',
      'packages/aura/src/**',
      'packages/vaadin-lumo-styles/*.{css,js}',
      'packages/vaadin-lumo-styles/!(test)/**',
    ],
    codeOnly: true,
  },
  {
    category: 'amber',
    reason: 'public TypeScript API',
    paths: ['packages/*/*.d.ts', 'packages/*/src/**/*.d.ts'],
    codeOnly: true,
  },
];

/**
 * Rules on the lines that a pull request adds to the source of the packages,
 * comments excluded. A rule matches when its pattern matches an added line.
 */
export const CONTENT_RULES = [
  {
    category: 'red',
    reason: 'HTML or script injection sink',
    paths: ['packages/*/src/**'],
    // Clearing the content with `innerHTML = ''` is common and safe
    pattern:
      /\b(?:inner|outer)HTML\s*\+?=(?!=)(?!\s*(?:''|""|``)\s*;?\s*$)|insertAdjacentHTML|unsafe(?:HTML|SVG)|dangerouslySetInnerHTML|DOMPurify|\beval\s*\(|new\s+Function\s*\(|document\.write/u,
  },
  {
    category: 'red',
    reason: 'network requests',
    paths: ['packages/*/src/**'],
    pattern:
      /(?<![\w.])fetch\s*\(|window\.fetch|XMLHttpRequest|withCredentials|sendBeacon|new\s+(?:WebSocket|EventSource)\b/u,
  },
  {
    category: 'red',
    reason: 'browser storage or cookies',
    paths: ['packages/*/src/**'],
    pattern: /\b(?:localStorage|sessionStorage|indexedDB)\b|document\.cookie/u,
  },
];

/** A breaking change, marked with `!` in the conventional commit title */
export const BREAKING_TITLE = /^\w+(?:\([^)]*\))?!:/u;

/**
 * Authors whose pull requests can be green. Other authors need at least one
 * human approval. Private members of the organization show up as CONTRIBUTOR,
 * so the workflow also checks the membership.
 */
export const TRUSTED_ASSOCIATIONS = ['OWNER', 'MEMBER', 'COLLABORATOR'];
