/**
 * The repository policy of the PR risk workflow (.github/workflows/pr-risk.yml).
 * Every rule that matches a pull request sets a minimum category for it. The
 * agent can suggest a higher category than the policy, never a lower one.
 *
 * The workflow runs the policy of the base branch, so a pull request that edits
 * this file is classified by the policy it replaces.
 */

/** Visual test screenshots, which have no text diff */
export const SCREENSHOT_PATHS = ['packages/*/test/visual/**/screenshots/**'];

/**
 * Rules on the changed files. A rule matches when one of its globs matches the
 * path of a changed file, or the previous path of a renamed file. Wildcards
 * also match names that start with a dot. A rule with `codeOnly` skips files
 * whose changes are only comments and blank lines, so that a JSDoc fix does
 * not need a reviewer.
 */
export const PATH_RULES = [
  {
    category: 'red',
    reason: 'CI, release and repository automation, or config that runs code',
    paths: [
      '.github/**',
      'scripts/**',
      'lerna.json',
      'patches/**',
      '.husky/**',
      '**/.yarnrc*',
      '**/.npmrc',
      '**/.gitattributes',
    ],
  },
  {
    category: 'red',
    reason: 'HTML sanitization',
    paths: ['packages/markdown/src/**', 'packages/rich-text-editor/src/**', 'packages/rich-text-editor/vendor/**'],
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
    paths: [
      '**/CLAUDE.md',
      '**/CLAUDE.local.md',
      '**/AGENTS.md',
      '**/.claude/**',
      '.mcp.json',
      'CONVENTIONS.md',
      'guidelines/**',
    ],
  },
  {
    category: 'amber',
    reason: 'test, lint and build tooling that CI relies on',
    paths: [
      '*.config.js',
      'wtr-utils.js',
      'wds-utils.js',
      'tsconfig.json',
      '.prettier*',
      '.stylelintrc*',
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
      'packages/vaadin-themable-mixin/src/**',
    ],
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
  },
  {
    category: 'amber',
    reason: 'visual test screenshots, so the rendering changed',
    paths: SCREENSHOT_PATHS,
  },
  {
    category: 'amber',
    reason: 'public TypeScript API',
    paths: ['packages/*/*.d.ts', 'packages/*/src/**/*.d.ts'],
    codeOnly: true,
  },
];

/** The code that the packages ship, which the content rules check */
export const CONTENT_PATHS = ['packages/*/src/**', 'packages/*/*.js'];

/**
 * Rules on the lines that a pull request adds to the code that the packages
 * ship. Comment lines count too, as code can follow a comment on the same line.
 */
export const CONTENT_RULES = [
  {
    category: 'red',
    reason: 'adds an HTML or script injection sink',
    // Comparing the content, or clearing it with `innerHTML = ''`, is common and safe
    pattern: new RegExp(
      [
        String.raw`\b(?:inner|outer)HTML\b(?!\s*(?:[!=]==?|=\s*(?:''|""|${'``'})\s*;?\s*$))`,
        String.raw`insertAdjacentHTML|setHTMLUnsafe|parseHTMLUnsafe|createContextualFragment|\bsrcdoc\b`,
        String.raw`\bunsafe(?:HTML|SVG|MathML|Static)\b|dangerouslySetInnerHTML|DOMPurify`,
        String.raw`\beval\s*\(|\bFunction\s*\(|document\.write`,
        // Event handler attributes and script URLs in HTML or SVG markup
        String.raw`<[^>]*\son[a-z]+\s*=|javascript:`,
      ].join('|'),
      'u',
    ),
  },
  {
    category: 'red',
    reason: 'adds network requests',
    // A bare `fetch()`, not a `fetch` method such as `dataProvider.fetch()`
    pattern: new RegExp(
      [
        String.raw`(?:^|[^\w.]|\b(?:window|globalThis|self)\.)fetch\s*\(`,
        String.raw`XMLHttpRequest|withCredentials|sendBeacon|new\s+(?:WebSocket|EventSource)\b`,
        // A dynamic import of anything but a string literal
        String.raw`\bimport\s*\(\s*(?!['"])`,
      ].join('|'),
      'u',
    ),
  },
  {
    category: 'red',
    reason: 'adds browser storage or cookies',
    pattern: /\b(?:localStorage|sessionStorage|indexedDB|cookieStore)\b|document\.cookie/u,
  },
];

/** A breaking change, marked with `!` in the conventional commit title */
export const BREAKING_TITLE = /^\w+(?:\([^)]*\))?!:/u;

/** A breaking change, marked with a conventional commit footer in the description */
export const BREAKING_BODY = /^BREAKING[ -]CHANGE:/mu;

/**
 * Authors whose pull requests can be green. Other authors need at least one
 * human approval. Private members of the organization show up as CONTRIBUTOR,
 * so the workflow also checks the membership.
 */
export const TRUSTED_ASSOCIATIONS = ['OWNER', 'MEMBER', 'COLLABORATOR'];
