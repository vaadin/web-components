/**
 * Test runner commands for touch in Chromium: `emulate-touch` makes it emulate
 * a touch device, so that e.g. the `(pointer: coarse)` media query matches
 * (pass `{ enabled: false }` to stop), and `dispatch-touch` sends real touch
 * input, see CDP `Input.dispatchTouchEvent`. Return false in other browsers.
 *
 * @return {import('@web/test-runner').TestRunnerPlugin}
 */
export function touchEmulationPlugin() {
  // Emulation only lasts while its CDP session is attached. The session lives
  // until the test runner closes the page after the test file.
  const sessions = new WeakMap();
  return {
    name: 'touch-emulation-command',
    async executeCommand({ command, payload, session }) {
      if (command !== 'emulate-touch' && command !== 'dispatch-touch') {
        return undefined;
      }
      if (session.browser.type !== 'playwright') {
        return false;
      }
      const page = session.browser.getPage(session.id);
      // The test runner treats null and undefined as a command that no plugin handles.
      if (page.context().browser().browserType().name() !== 'chromium') {
        return false;
      }
      if (!sessions.has(page)) {
        sessions.set(page, await page.context().newCDPSession(page));
      }
      const cdp = sessions.get(page);
      if (command === 'dispatch-touch') {
        // Real touch input, which the browser also uses for scrolling, unlike synthetic events.
        await cdp.send('Input.dispatchTouchEvent', payload);
        return true;
      }
      const enabled = !!(payload && payload.enabled);
      await cdp.send('Emulation.setTouchEmulationEnabled', { enabled, maxTouchPoints: enabled ? 5 : 1 });
      return true;
    },
  };
}
