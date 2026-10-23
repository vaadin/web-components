// Runs a key sequence on a dev page with NVDA through Guidepup and prints the spoken phrases.
// Usage: node .claude/skills/nvda-check/scripts/nvda.mjs --page select.html
//   [--browser chrome|firefox] [--origin http://localhost:8000] [--focus "combo box"]
//   [--steps ArrowDown,ArrowDown,Enter] [--capture full|initial] [--out <file.json>]
// - Opens <origin>/dev/<page> on a running dev server, starts NVDA, and presses Tab until a phrase matches
//   --focus (a case-insensitive regex). That Tab is the first recorded step. --page can carry a query, such as
//   `select.html?theme=lumo`.
// - Then runs --steps. A step is a key (`Tab`, `Shift+Tab`, `ArrowDown`, `End`, `Space`, `Enter`, `Escape`, `s`)
//   or an NVDA command: `NVDA+browse` and `NVDA+focus` (toggle until in that mode), `NVDA+Space` (toggle once),
//   `NVDA+Tab` (report focus), `NVDA+next`, `NVDA+previous`, `NVDA+act`, or `NVDA+<name>` for any Guidepup
//   `keyboardCommands` name such as `NVDA+reportTitle`. In browse mode, NVDA takes the arrow keys and the letters.
// - Prints the phrases of each step. NVDA puts a period between the speech sequences and a comma between the
//   fields. --out writes the whole log as JSON.
// - Chrome is the installed Google Chrome through Playwright. Firefox is the installed Firefox with a new profile.
// Requires `npx @guidepup/setup install` once. It downloads a portable NVDA to %LOCALAPPDATA%\guidepup.
import { nvda } from '@guidepup/guidepup';
import { execFile, spawn } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { parseArgs, promisify } from 'node:util';

const MAX_TABS = 20;
const MAX_ACTIVATE_ATTEMPTS = 6;
const ACTIVATE = path.join(import.meta.dirname, 'activate.ps1');
const FIREFOX = path.join(process.env.ProgramFiles ?? 'C:\\Program Files', 'Mozilla Firefox', 'firefox.exe');

// Skips the Firefox first-run pages and prompts, so the page has focus.
const FIREFOX_PREFS = {
  'app.normandy.enabled': false,
  'browser.aboutwelcome.enabled': false,
  'browser.preonboarding.enabled': false,
  'browser.shell.checkDefaultBrowser': false,
  'browser.startup.firstrunSkipsHomepage': true,
  'browser.startup.homepage_override.mstone': 'ignore',
  'browser.startup.upgradeDialog.enabled': false,
  'browser.uitour.enabled': false,
  'datareporting.policy.dataSubmissionEnabled': false,
  'datareporting.policy.dataSubmissionPolicyBypassNotification': true,
  'startup.homepage_welcome_url': '',
  'startup.homepage_welcome_url.additional': '',
  'termsofuse.bypassNotification': true,
  'toolkit.telemetry.reportingpolicy.firstRun': false,
  'trailhead.firstrun.didSeeAboutWelcome': true,
};

const run = promisify(execFile);
const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
const t0 = Date.now();
const log = (text) => console.log(`${((Date.now() - t0) / 1000).toFixed(1)}s ${text}`);

/** Letters and digits only, in lower case, for a loose comparison of spoken text. */
const normalize = (text) => text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');

const { values: args } = parseArgs({
  options: {
    page: { type: 'string' },
    browser: { type: 'string', default: 'chrome' },
    origin: { type: 'string', default: 'http://localhost:8000' },
    focus: { type: 'string', default: 'combo box' },
    steps: { type: 'string', default: '' },
    capture: { type: 'string', default: 'full' },
    out: { type: 'string' },
  },
});

if (
  process.platform !== 'win32' ||
  !args.page ||
  !['chrome', 'firefox'].includes(args.browser) ||
  !['full', 'initial'].includes(args.capture)
) {
  console.error(
    'Usage (Windows only): node .claude/skills/nvda-check/scripts/nvda.mjs --page <file in dev/>' +
      ' [--browser chrome|firefox] [--origin <url>] [--focus <regex>] [--steps <key,key,...>]' +
      ' [--capture full|initial] [--out <file.json>]',
  );
  process.exit(2);
}

const url = `${args.origin.replace(/\/$/u, '')}/dev/${args.page}`;
const focus = new RegExp(args.focus, 'iu');
const steps = args.steps ? args.steps.split(',').map((step) => step.trim()) : [];

// The window title starts with the page title. The activation matches it.
let title;

/**
 * Toggles browse and focus mode until NVDA speaks the given mode. A run can start in either mode, so a
 * single toggle can land in the wrong one.
 * @param {'browse' | 'focus'} mode
 */
async function switchMode(mode) {
  for (let attempt = 0; attempt < 2; attempt++) {
    await nvda.perform(nvda.keyboardCommands.toggleBetweenBrowseAndFocusMode);
    const spoken = (await nvda.spokenPhraseLog()).join(' ').match(/\b(browse|focus) mode\b/giu);
    if (spoken?.at(-1).toLowerCase() === `${mode} mode`) return;
  }
  throw new Error(`NVDA did not switch to ${mode} mode`);
}

// NVDA commands by the keys of the manual steps.
const commands = {
  Space: () => nvda.perform(nvda.keyboardCommands.toggleBetweenBrowseAndFocusMode),
  browse: () => switchMode('browse'),
  focus: () => switchMode('focus'),
  Tab: () => nvda.perform(nvda.keyboardCommands.reportCurrentFocus),
  next: () => nvda.next(),
  previous: () => nvda.previous(),
  act: () => nvda.act(),
};

/** Runs one step and returns the phrases NVDA spoke for it. */
const step = async (token) => {
  await nvda.clearSpokenPhraseLog();
  if (token.startsWith('NVDA+')) {
    const command = token.slice(5);
    if (commands[command]) await commands[command]();
    else if (nvda.keyboardCommands[command]) await nvda.perform(nvda.keyboardCommands[command]);
    else throw new Error(`Unknown NVDA command ${token}`);
  } else {
    await nvda.press(token);
  }
  const phrases = await nvda.spokenPhraseLog();
  log(`${token}: ${JSON.stringify(phrases)}`);
  return { key: token, phrases };
};

async function open() {
  if (args.browser === 'chrome') {
    const { chromium } = await import('playwright');
    const chrome = await chromium.launch({ channel: 'chrome', headless: false });
    const page = await chrome.newPage();
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    title = await page.title();
    return () => chrome.close();
  }
  if (!fs.existsSync(FIREFOX)) throw new Error(`No Firefox at ${FIREFOX}`);
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'guidepup-firefox-'));
  const prefs = Object.entries(FIREFOX_PREFS).map(([key, value]) => `user_pref("${key}", ${JSON.stringify(value)});`);
  fs.writeFileSync(path.join(profile, 'user.js'), `${prefs.join('\n')}\n`);
  // -wait-for-browser keeps the launcher process alive, so taskkill /T reaches the browser.
  const firefox = spawn(FIREFOX, ['-no-remote', '-profile', profile, '-wait-for-browser', url], { stdio: 'ignore' });
  title = (await (await fetch(url)).text()).match(/<title>([^<]*)<\/title>/u)?.[1] ?? '';
  await delay(5000);
  return async () => {
    await run('taskkill', ['/PID', String(firefox.pid), '/T', '/F']).catch(() => {});
    await delay(1000);
    // The killed processes release the profile files late, so retry.
    fs.rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 500 });
  };
}

/** Brings the browser to the front, and checks the window title that NVDA reads. */
async function activate() {
  const processName = args.browser === 'chrome' ? 'chrome' : 'firefox';
  for (let attempt = 0; attempt < MAX_ACTIVATE_ATTEMPTS; attempt++) {
    const { stdout } = await run('powershell', [
      '-NoProfile',
      '-ExecutionPolicy',
      'Bypass',
      '-File',
      ACTIVATE,
      processName,
      title,
    ]).catch((error) => ({ stdout: String(error) }));
    await delay(1000);
    await nvda.clearSpokenPhraseLog();
    await nvda.perform(nvda.keyboardCommands.reportTitle);
    const phrases = await nvda.spokenPhraseLog();
    // NVDA splits the title for speech, such as "A 1" for "A1", so the check ignores spaces and punctuation.
    if (normalize(phrases.join(' ')).includes(normalize(title))) return;
    log(`activate ${attempt + 1} (${stdout.trim()}): ${JSON.stringify(phrases)}`);
  }
  throw new Error(`No window "${title}" in front after ${MAX_ACTIVATE_ATTEMPTS} attempts`);
}

let close;
let started = false;
try {
  log(`page ${url}`);
  close = await open();
  // Guidepup starts NVDA with its own portable config, so an installed NVDA and its settings do not apply.
  // Speech Viewer off: its window takes the focus from the browser on start.
  // Audio indication off: NVDA then speaks "focus mode" and "browse mode" instead of a beep.
  await nvda.start({
    capture: args.capture === 'initial' ? 'initial' : true,
    settings: {
      speechViewer: { showSpeechViewerAtStartup: false },
      virtualBuffers: { passThroughAudioIndication: false },
    },
  });
  started = true;
  log(`NVDA ${nvda.version} started, capture ${args.capture}`);

  await activate();
  // Let the window announcements finish, then drop them.
  await delay(2000);
  log(`front: ${JSON.stringify(await nvda.spokenPhraseLog())}`);
  await nvda.clearSpokenPhraseLog();

  // Tab until the focus target has focus. The last Tab is the first recorded step.
  const setup = [];
  let first;
  for (let i = 0; i < MAX_TABS; i++) {
    const result = await step('Tab');
    if (result.phrases.some((text) => focus.test(text))) {
      first = result;
      break;
    }
    setup.push(result);
  }
  if (!first) throw new Error(`No phrase matched ${focus} after ${MAX_TABS} Tab presses`);

  const results = [first];
  for (const token of steps) results.push(await step(token));

  if (args.out) {
    const result = {
      reader: 'NVDA',
      readerVersion: nvda.version,
      guidepup: createRequire(import.meta.url)('@guidepup/guidepup/package.json').version,
      browser: args.browser,
      url,
      focus: args.focus,
      capture: args.capture,
      date: new Date().toISOString(),
      setup,
      steps: results,
    };
    fs.mkdirSync(path.dirname(path.resolve(args.out)), { recursive: true });
    fs.writeFileSync(args.out, `${JSON.stringify(result, null, 2)}\n`);
    log(`wrote ${args.out}`);
  }
  console.table(results.map(({ key, phrases }) => ({ key, phrases: phrases.join(' | ') })));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  if (started) await nvda.stop().catch((error) => console.error('stop failed', error.message));
  if (close) await close().catch((error) => console.error('close failed', error.message));
}
