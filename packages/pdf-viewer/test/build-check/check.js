/**
 * Builds the app in this folder with Vite, serves it with the Content
 * Security Policy of the README, and checks the viewer in Chromium, Firefox and WebKit.
 * Prints a Markdown report. Run from the repository root:
 *
 *   node packages/pdf-viewer/test/build-check/check.js
 *
 * With `--serve`, it builds the app and serves it with the policy until
 * stopped, for checks by hand. See README.md.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { dirname, extname, join, normalize } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import playwright from 'playwright';
import { build, version as viteVersion } from 'vite';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');
const viewerSources = join(root, '../../src');

/**
 * The policy of the README. The server adds the reporting, see `withReporting()`.
 * `style-src 'unsafe-inline'` is what every Vaadin app needs today, see
 * https://github.com/vaadin/web-components/issues/8031 and
 * https://github.com/vaadin/platform/issues/9488.
 */
const POLICY =
  "default-src 'self'; script-src 'self'; worker-src 'self'; img-src 'self' blob: data:; " +
  "style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self'";

const REPORT_PATH = '/csp-report';

const POLICIES = [
  { name: 'README', policy: POLICY, expectLoad: true },
  {
    name: "README + 'wasm-unsafe-eval'",
    policy: POLICY.replace("script-src 'self'", "script-src 'self' 'wasm-unsafe-eval'"),
    expectLoad: true,
  },
  {
    // Checks that the harness sees a violation, and that a blocked worker fails the load instead of hanging.
    name: "control: worker-src 'none'",
    policy: POLICY.replace("worker-src 'self'", "worker-src 'none'"),
    expectLoad: false,
  },
];

const ENGINES = ['chromium', 'firefox', 'webkit'];

const TIMEOUT = 30000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.pdf': 'application/pdf',
};

/**
 * Adds the reporting to a policy: `report-uri` sends the violations to the
 * server, also those of the worker, and `'report-sample'` adds the start of
 * a blocked inline style. Neither changes what the policy allows.
 */
function withReporting(policy) {
  return `${policy.replace(/(script-src|style-src) /gu, "$1 'report-sample' ")}; report-uri ${REPORT_PATH}`;
}

/**
 * Serves `dist/` with the current policy. Answers Range requests with 206,
 * so that the viewer could use them, and logs every request.
 */
function startServer(state) {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (req.method === 'POST' && url.pathname === REPORT_PATH) {
      let body = '';
      for await (const chunk of req) {
        body += chunk;
      }
      try {
        state.reports.push(JSON.parse(body)['csp-report']);
      } catch {
        state.reports.push({ 'blocked-uri': `unreadable report: ${body}` });
      }
      res.writeHead(204).end();
      return;
    }

    state.requests.push({ path: url.pathname, range: req.headers.range });
    const file = join(dist, normalize(url.pathname === '/' ? '/index.html' : url.pathname));
    let size;
    try {
      size = (await stat(file)).size;
    } catch {
      res.writeHead(404).end();
      return;
    }

    const headers = {
      'Content-Type': MIME_TYPES[extname(file)] || 'application/octet-stream',
      'Content-Security-Policy': withReporting(state.policy),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-store',
    };
    const data = await readFile(file);
    const range = /^bytes=(\d*)-(\d*)$/u.exec(req.headers.range || '');
    if (range) {
      const start = range[1] ? Number(range[1]) : size - Number(range[2]);
      const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
      res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}` });
      res.end(data.subarray(start, end + 1));
      return;
    }
    res.writeHead(200, headers);
    res.end(data);
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

/**
 * Runs in the page before its scripts. Records the workers that the page
 * creates and the violations that it sees, with the element of a blocked
 * style attribute and whether the viewer renders that element.
 */
function instrumentPage() {
  const check = { workers: [], violations: [] };
  window.__check = check;

  const NativeWorker = window.Worker;
  window.Worker = class extends NativeWorker {
    constructor(url, options) {
      check.workers.push({ url: String(url), type: (options && options.type) || 'classic' });
      super(url, options);
    }
  };

  check.record = (event) => {
    const element = event.composedPath()[0];
    let inViewer = false;
    for (let node = element; node && node.nodeType === Node.ELEMENT_NODE; node = node.getRootNode().host) {
      if (node.closest('vaadin-pdf-viewer')) {
        inViewer = true;
        break;
      }
    }
    const part = element.getAttribute && element.getAttribute('part');
    check.violations.push({
      directive: event.effectiveDirective,
      blockedURL: event.blockedURI,
      sourceFile: event.sourceFile,
      line: event.lineNumber,
      sample: event.sample,
      element: element.localName ? `${element.localName}${part ? `[part="${part}"]` : ''}` : '',
      inViewer,
    });
  };
  document.addEventListener('securitypolicyviolation', check.record);
}

/**
 * Runs in the page: opens the sidebar and the find bar, so that their
 * templates render, and waits until the thumbnails show.
 */
async function showSidebarAndFind() {
  const viewer = document.querySelector('vaadin-pdf-viewer');
  const findResult = new Promise((resolve) => {
    viewer.addEventListener('find-result', (event) => resolve(event.detail.matchCount), { once: true });
  });
  viewer.sidebarOpened = true;
  viewer.find('the');
  const matchCount = await findResult;
  const start = performance.now();
  while (!viewer.shadowRoot.querySelector('[part~="thumbnail"] canvas') && performance.now() - start < 10000) {
    await new Promise((resolve) => {
      requestAnimationFrame(resolve);
    });
  }
  return { matchCount, thumbnails: !!viewer.shadowRoot.querySelector('[part~="thumbnail"] canvas') };
}

/**
 * Runs in the page: calls `print()` with the print dialog replaced, and
 * returns how many page images the print frame has and how many of them loaded.
 */
async function printWithoutDialog() {
  const frames = [];
  const observer = new MutationObserver((records) => {
    records.forEach((record) => {
      record.addedNodes.forEach((node) => {
        if (node.localName !== 'iframe') {
          return;
        }
        const frameWindow = node.contentWindow;
        const info = { images: 0, loaded: 0 };
        node.contentDocument.addEventListener('securitypolicyviolation', window.__check.record);
        frameWindow.print = () => {
          const images = [...node.contentDocument.images];
          info.images = images.length;
          info.loaded = images.filter((image) => image.complete && image.naturalWidth > 0).length;
          setTimeout(() => frameWindow.dispatchEvent(new Event('afterprint')));
        };
        frames.push(info);
      });
    });
  });
  observer.observe(document.body, { childList: true });
  await document.querySelector('vaadin-pdf-viewer').print();
  observer.disconnect();
  return frames[0] || { images: 0, loaded: 0 };
}

/**
 * Returns the module that a line of the built code comes from. The build is
 * not minified, so Vite marks each module with a `//#region <path>` comment.
 */
async function findModule(sourceFile, line) {
  const path = sourceFile && new URL(sourceFile, 'http://localhost').pathname;
  if (!path || !path.startsWith('/assets/') || !line) {
    return '';
  }
  const lines = (await readFile(join(dist, path), 'utf8')).split('\n');
  for (let index = line - 1; index >= 0; index--) {
    const region = /^\/\/#region (.*)$/u.exec(lines[index]);
    if (region) {
      return region[1].replace(/^.*node_modules\//u, '');
    }
  }
  return path;
}

/** Whether a template of the viewer has a `style` attribute that starts with the given text. */
async function isViewerTemplateStyle(sample) {
  const files = (await readdir(viewerSources)).filter((file) => file.endsWith('.js'));
  const sources = await Promise.all(files.map((file) => readFile(join(viewerSources, file), 'utf8')));
  return sources.some((source) => source.includes(`style="${sample}`));
}

/**
 * Names the part of the app that a violation comes from: `viewer` for the
 * viewer, its worker, its document and pdf.js, `outside` for the rest of the app.
 */
async function attribute(violation) {
  const { directive, blockedURL = '', sourceFile, line, sample, element, inViewer } = violation;
  const url = blockedURL.startsWith('http') ? new URL(blockedURL).pathname : blockedURL;
  if (blockedURL.startsWith('blob:')) {
    return { owner: 'viewer', what: 'print or download' };
  }
  if (blockedURL === 'wasm-eval') {
    return { owner: 'viewer', what: 'pdf.js WebAssembly', optional: true };
  }
  if (/\/assets\/pdf-viewer-worker-/u.test(url)) {
    return { owner: 'viewer', what: 'worker script' };
  }
  if (url.endsWith('.pdf')) {
    return { owner: 'viewer', what: 'document request' };
  }
  if (directive === 'style-src-attr' && element) {
    return { owner: inViewer ? 'viewer' : 'outside', what: `\`style\` attribute of \`${element}\`` };
  }
  if (directive === 'style-src-attr' && sample && (await isViewerTemplateStyle(sample))) {
    // Blocked while Lit parses a template, before the element exists.
    return { owner: 'viewer', what: `\`style="${sample}"\` in a template` };
  }
  const module = await findModule(sourceFile, line);
  const isViewer = /packages\/pdf-viewer\/|pdfjs-dist\//u.test(module);
  return { owner: isViewer ? 'viewer' : 'outside', what: module ? `\`${module}\`` : 'unknown source' };
}

function normalizeReport(report) {
  return {
    directive: report['effective-directive'] || report['violated-directive'],
    blockedURL: report['blocked-uri'],
    sourceFile: report['source-file'],
    line: report['line-number'],
    sample: report['script-sample'],
  };
}

/**
 * Merges the violations that the page saw with the reports that the server
 * received, which also cover the worker. Counts repeated violations once.
 */
async function collectViolations(pageViolations, reports) {
  const key = ({ directive, blockedURL, sourceFile, line }) => `${directive} ${blockedURL} ${sourceFile} ${line}`;
  const seen = new Set(pageViolations.map(key));
  const violations = [...pageViolations, ...reports.map(normalizeReport).filter((report) => !seen.has(key(report)))];
  const unique = new Map();
  for (const violation of violations) {
    const { owner, what, optional } = await attribute(violation);
    const id = `${violation.directive} ${violation.blockedURL} ${what}`;
    if (!unique.has(id)) {
      unique.set(id, { directive: violation.directive, blockedURL: violation.blockedURL, owner, what, optional });
    }
  }
  return [...unique.values()];
}

async function runCase(browser, baseUrl, state, { policy, expectLoad }) {
  state.policy = policy;
  state.requests = [];
  state.reports = [];

  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  const threads = [];
  const logs = new Set();
  const errors = [];
  const onConsole = (message) => logs.add(message.text());
  page.on('console', onConsole);
  page.on('worker', (worker) => {
    threads.push(worker.url());
    worker.on('console', onConsole);
  });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(instrumentPage);

  const result = { errors };
  try {
    await page.goto(baseUrl);
    await page.waitForFunction(() => document.querySelector('#status').dataset.state !== 'loading', null, {
      timeout: TIMEOUT,
    });
    const status = await page.locator('#status').evaluate((element) => ({ ...element.dataset }));
    result.state = status.state === 'error' ? `error (${status.reason})` : status.state;

    if (status.state === 'loaded') {
      await page.waitForFunction(
        () =>
          [...document.querySelector('vaadin-pdf-viewer').shadowRoot.querySelectorAll('[part~="page"] canvas')].some(
            (canvas) => canvas.width > 0,
          ),
        null,
        { timeout: TIMEOUT },
      );
      result.rendered = true;
      result.ui = await page.evaluate(showSidebarAndFind);

      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: TIMEOUT }),
        page.evaluate(() => document.querySelector('vaadin-pdf-viewer').download()),
      ]);
      result.download = download.suggestedFilename();
      result.print = await page.evaluate(printWithoutDialog);
    }
  } catch (error) {
    errors.push(error.message.split('\n')[0]);
  }

  // Reports arrive after the violation.
  await page.waitForTimeout(1000);
  const pageState = await page
    .evaluate(() => ({ workers: window.__check.workers, violations: window.__check.violations }))
    .catch(() => ({ workers: [], violations: [] }));
  await context.close();

  const pdfRequests = state.requests.filter((request) => request.path.endsWith('.pdf'));
  result.violations = await collectViolations(pageState.violations, state.reports);
  result.workers = pageState.workers;
  result.threads = threads;
  result.fakeWorker = [...logs].some((text) => text.includes('Setting up fake worker'));
  result.pdfRequests = pdfRequests.length;
  result.rangeRequests = pdfRequests.filter((request) => request.range).length;

  const viewerViolations = result.violations.filter((violation) => violation.owner === 'viewer');
  const workerOk = result.threads.length > 0 && result.workers.every((worker) => worker.type === 'module');
  result.passed = expectLoad
    ? result.state === 'loaded' &&
      result.rendered &&
      result.ui?.thumbnails &&
      result.ui?.matchCount > 0 &&
      workerOk &&
      !result.fakeWorker &&
      result.pdfRequests === 1 &&
      result.rangeRequests === 0 &&
      !!result.download &&
      result.print?.images > 0 &&
      result.print.loaded === result.print.images &&
      viewerViolations.every((violation) => violation.optional) &&
      errors.length === 0
    : result.state === 'error (network)' &&
      !result.fakeWorker &&
      viewerViolations.some((violation) => violation.what === 'worker script');
  return result;
}

function formatReport(results, versions) {
  const lines = [
    `Viewer build check, ${new Date().toISOString()}`,
    '',
    `Vite ${versions.vite}, default worker format (\`iife\`), not minified. Playwright ${versions.playwright}.`,
    'The app loads file 05 and opens the sidebar and the find bar, then downloads and prints.',
    '',
    `Policy: \`${POLICY}\``,
    '',
    '| Engine | Policy | Load | Worker type, threads | Fake worker | PDF GETs | Range | Download | Print images | Viewer violations | Other violations | Pass |',
    '| ------ | ------ | ---- | -------------------- | ----------- | -------- | ----- | -------- | ------------ | ----------------- | ---------------- | ---- |',
  ];
  results.forEach(({ engine, version, name, result }) => {
    const workerTypes = [...new Set(result.workers.map((worker) => worker.type))].join(', ') || 'none created';
    const print = result.print ? `${result.print.loaded}/${result.print.images}` : '-';
    const viewer = result.violations.filter((violation) => violation.owner === 'viewer').length;
    const other = result.violations.length - viewer;
    lines.push(
      `| ${engine} ${version} | ${name} | ${result.state || 'timeout'} | ${workerTypes}, ${result.threads.length} running | ` +
        `${result.fakeWorker ? 'yes' : 'no'} | ${result.pdfRequests} | ${result.rangeRequests} | ` +
        `${result.download ? 'yes' : '-'} | ${print} | ${viewer} | ${other} | ${result.passed ? 'yes' : 'NO'} |`,
    );
  });

  const details = results.filter(({ result }) => result.violations.length > 0 || result.errors.length > 0);
  if (details.length > 0) {
    lines.push('', 'Violations and errors:', '');
    details.forEach(({ engine, name, result }) => {
      result.violations.forEach(({ directive, blockedURL, owner, what }) => {
        const blocked = blockedURL.startsWith('http') ? new URL(blockedURL).pathname : blockedURL;
        lines.push(`- ${engine}, ${name}: ${owner}, \`${directive}\` blocked \`${blocked}\`, ${what}`);
      });
      result.errors.forEach((error) => lines.push(`- ${engine}, ${name}: error \`${error}\``));
    });
  }
  return lines.join('\n');
}

async function main() {
  await build({ root, configFile: false, logLevel: 'warn', build: { outDir: dist, emptyOutDir: true, minify: false } });

  const state = { policy: POLICY, requests: [], reports: [] };
  const server = await startServer(state);
  const baseUrl = `http://127.0.0.1:${server.address().port}/`;

  if (process.argv.includes('--serve')) {
    process.stdout.write(`Serving ${dist} with the policy at ${baseUrl}\n`);
    return;
  }

  const results = [];
  try {
    for (const engine of ENGINES) {
      const browser = await playwright[engine].launch();
      try {
        for (const policy of POLICIES) {
          const result = await runCase(browser, baseUrl, state, policy);
          results.push({ engine, version: browser.version(), name: policy.name, result });
        }
      } finally {
        await browser.close();
      }
    }
  } finally {
    server.close();
  }

  const versions = {
    vite: viteVersion,
    playwright: createRequire(import.meta.url)('playwright/package.json').version,
  };
  process.stdout.write(`${formatReport(results, versions)}\n`);
  if (results.some(({ result }) => !result.passed)) {
    process.exitCode = 1;
  }
}

await main();
