// Runs a key sequence on a dev page with VoiceOver through Guidepup and prints the spoken phrases.
// Usage: node .claude/skills/voiceover-check/scripts/voiceover.mjs --page select.html
//   [--browser safari|chrome] [--origin http://localhost:8000] [--focus "combo box"]
//   [--steps ArrowDown,ArrowDown,Enter] [--capture full|initial] [--out <file.json>]
// - Opens <origin>/dev/<page> on a running dev server, starts VoiceOver, and presses Tab until a phrase or
//   the item text matches --focus (a case-insensitive regex). That Tab is the first recorded step.
// - Then runs --steps. A step is a key (`Tab`, `Shift+Tab`, `ArrowDown`, `End`, `Space`, `Enter`, `Escape`)
//   or a VoiceOver command: `VO+ArrowRight` (next item), `VO+ArrowLeft` (previous item), `VO+Space`
//   (activate), `VO+Shift+ArrowDown` (interact), `VO+Shift+ArrowUp` (stop interacting), or `VO+<name>` for
//   any Guidepup `keyboardCommands` name such as `VO+describeItemWithKeyboardFocus`.
// - Prints the phrases JSON-escaped. Guidepup folds runs of whitespace, so `raw` adds the last VoiceOver phrase
//   as VoiceOver has it, with its line breaks. --out writes the whole log as JSON.
// - Safari is the real Safari (`open -a Safari`). Chrome is the installed Google Chrome through Playwright.
import { macOSActivate, MacOSApplications, macOSQuit, voiceOver } from '@guidepup/guidepup';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { parseArgs, promisify } from 'node:util';

const MAX_TABS = 20;
const run = promisify(execFile);
const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
const t0 = Date.now();
const log = (text) => console.log(`${((Date.now() - t0) / 1000).toFixed(1)}s ${text}`);

const { values: args } = parseArgs({
  options: {
    page: { type: 'string' },
    browser: { type: 'string', default: 'safari' },
    origin: { type: 'string', default: 'http://localhost:8000' },
    focus: { type: 'string', default: 'combo box' },
    steps: { type: 'string', default: '' },
    capture: { type: 'string', default: 'full' },
    out: { type: 'string' },
  },
});

if (!args.page || !['safari', 'chrome'].includes(args.browser) || !['full', 'initial'].includes(args.capture)) {
  console.error(
    'Usage: node .claude/skills/voiceover-check/scripts/voiceover.mjs --page <file in dev/>' +
      ' [--browser safari|chrome] [--origin <url>] [--focus <regex>] [--steps <key,key,...>]' +
      ' [--capture full|initial] [--out <file.json>]',
  );
  process.exit(2);
}

const url = `${args.origin.replace(/\/$/u, '')}/dev/${args.page}`;
const focus = new RegExp(args.focus, 'iu');
const steps = args.steps ? args.steps.split(',').map((step) => step.trim()) : [];

// VoiceOver commands by the keys of the manual steps.
const commands = {
  ArrowRight: () => voiceOver.next(),
  ArrowLeft: () => voiceOver.previous(),
  Space: () => voiceOver.act(),
  'Shift+ArrowDown': () => voiceOver.interact(),
  'Shift+ArrowUp': () => voiceOver.stopInteracting(),
};

/** Returns the last VoiceOver phrase without the Guidepup clean-up. */
const rawLastPhrase = async () => {
  const script = 'tell application "VoiceOver" to return content of last phrase';
  const { stdout } = await run('osascript', ['-e', script]).catch(() => ({ stdout: '' }));
  return stdout.replace(/\n$/u, '');
};

/** Runs one step and returns the phrases VoiceOver spoke for it. */
const step = async (token) => {
  await voiceOver.clearSpokenPhraseLog();
  if (token.startsWith('VO+')) {
    const command = token.slice(3);
    if (commands[command]) await commands[command]();
    else if (voiceOver.keyboardCommands[command]) await voiceOver.perform(voiceOver.keyboardCommands[command]);
    else throw new Error(`Unknown VoiceOver command ${token}`);
  } else {
    await voiceOver.press(token);
  }
  const phrases = await voiceOver.spokenPhraseLog();
  const itemText = await voiceOver.itemText().catch(() => '');
  const raw = await rawLastPhrase();
  log(`${token}: ${JSON.stringify(phrases)}`);
  return { key: token, phrases, raw, itemText };
};

// The phrase log can drop a phrase, so the item text is the fallback.
const isFocusTarget = ({ phrases, itemText }) => [...phrases, itemText].some((text) => focus.test(text));

async function open() {
  if (args.browser === 'chrome') {
    const { chromium } = await import('playwright');
    const chrome = await chromium.launch({
      channel: 'chrome',
      headless: false,
      args: ['--force-renderer-accessibility'],
    });
    const page = await chrome.newPage();
    await page.goto(url);
    await page.bringToFront();
    return () => chrome.close();
  }
  // Leave a Safari that the user had open. Quit the Safari that this script opened.
  const { stdout } = await run('pgrep', ['-x', 'Safari']).catch(() => ({ stdout: '' }));
  const safariWasRunning = stdout.trim() !== '';
  await run('open', ['-a', 'Safari', url]);
  await delay(3000);
  return safariWasRunning ? async () => {} : () => macOSQuit(MacOSApplications.Safari);
}

let close;
let started = false;
try {
  log(`page ${url}`);
  close = await open();
  // Guidepup starts VoiceOver with its own profile, so VoiceOver Utility settings do not apply.
  // Instructions off: the "You are currently on..." hints hide short phrases and slow every step.
  await voiceOver.start({
    capture: args.capture === 'initial' ? 'initial' : true,
    settings: { SCRShouldOutputVOInstructions: 0 },
  });
  started = true;
  log(`VoiceOver ${voiceOver.version} started, capture ${args.capture}`);

  await macOSActivate(args.browser === 'safari' ? MacOSApplications.Safari : 'Google Chrome');
  // Let the window announcements finish, then drop them.
  await delay(2000);
  log(`front: ${JSON.stringify(await voiceOver.spokenPhraseLog())}`);
  await voiceOver.clearSpokenPhraseLog();

  // Tab until the focus target has focus. The last Tab is the first recorded step.
  const setup = [];
  let first;
  for (let i = 0; i < MAX_TABS; i++) {
    const result = await step('Tab');
    if (isFocusTarget(result)) {
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
      reader: 'VoiceOver',
      readerVersion: voiceOver.version,
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
  console.table(
    results.map(({ key, phrases, raw, itemText }) => ({
      key,
      phrases: phrases.map((phrase) => JSON.stringify(phrase)).join(' | '),
      raw: JSON.stringify(raw),
      itemText: JSON.stringify(itemText),
    })),
  );
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  if (started) await voiceOver.stop().catch((error) => console.error('stop failed', error.message));
  if (close) await close().catch((error) => console.error('close failed', error.message));
}
