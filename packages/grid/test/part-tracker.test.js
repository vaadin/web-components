import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import {
  isPartTargeted,
  registerPartTrackingHost,
  unregisterPartTrackingHost,
} from '@vaadin/grid/src/vaadin-grid-part-tracker.js';

class PartTrackerTestHost extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
}
customElements.define('part-tracker-test-host', PartTrackerTestHost);

class PartTrackerNoShadowHost extends HTMLElement {}
customElements.define('part-tracker-no-shadow-host', PartTrackerNoShadowHost);

// Pre-existing style added at module load — present *before* the tracker has
// ever been initialized. Used to assert that the very first call to
// `isPartTargeted` runs an initial scan that picks up styles already in the
// document. Test order is irrelevant: whichever test triggers init first will
// scan this style; later tests can also assert against it.
const PRE_EXISTING_PART = '__part-tracker-pre-existing__';
const __preExistingStyle = document.createElement('style');
__preExistingStyle.textContent = `vaadin-grid::part(${PRE_EXISTING_PART}) {}`;
document.head.appendChild(__preExistingStyle);

let nameCounter = 0;
function uniqueName(base) {
  nameCounter += 1;
  return `${base}-${nameCounter}`;
}

describe('vaadin-grid-part-tracker', () => {
  let addedDomSheets, addedAdoptedSheets, warnStub;

  beforeEach(() => {
    addedDomSheets = [];
    addedAdoptedSheets = [];
    warnStub = sinon.stub(console, 'warn');
    // Trigger init() via `isPartTargeted` so the MutationObserver and
    // theme-changed listener are wired up before each test runs its
    // mutation-driven assertions. The unique name avoids polluting any
    // shared state across tests.
    isPartTargeted(uniqueName('prime'));
  });

  afterEach(() => {
    addedDomSheets.forEach((node) => node.remove());
    document.adoptedStyleSheets = document.adoptedStyleSheets.filter((sheet) => !addedAdoptedSheets.includes(sheet));
    warnStub.restore();
  });

  function addStyle(cssText) {
    const style = document.createElement('style');
    style.textContent = cssText;
    document.head.appendChild(style);
    addedDomSheets.push(style);
    return style;
  }

  function addAdopted(cssText) {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(cssText);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    addedAdoptedSheets.push(sheet);
    return sheet;
  }

  function makeHost() {
    return fixtureSync(`<part-tracker-test-host></part-tracker-test-host>`);
  }

  function addChildWithClass(host, className) {
    const div = document.createElement('div');
    div.classList.add(className);
    host.shadowRoot.appendChild(div);
    return div;
  }

  describe('init', () => {
    it('should pick up rules present in the document before init has ever run', () => {
      // The pre-existing <style> was appended at module load, before any
      // tracker entry-point was called. The very first call to init() (which
      // happened in the first beforeEach via registerPartTrackingHost) must
      // have walked document.styleSheets and recorded this rule. Without the
      // initial `rescan()` inside init, this would fail.
      expect(isPartTargeted(PRE_EXISTING_PART)).to.be.true;
    });

    it('should set up its observers exactly once across many init triggers', () => {
      // beforeEach already triggered init via registerPartTrackingHost. Any
      // further entry-point calls must NOT construct another MutationObserver
      // or attach another `theme-changed` listener — i.e. the `initialized`
      // guard inside init() must short-circuit subsequent calls.
      const observerSpy = sinon.spy(window, 'MutationObserver');
      const detectorSpy = sinon.spy(document.__themeDetector, 'addEventListener');
      try {
        isPartTargeted('idempotent-1');
        isPartTargeted('idempotent-2');
        registerPartTrackingHost(document.createElement('div'));
        registerPartTrackingHost(document.createElement('div'));
        expect(observerSpy.called).to.be.false;
        expect(detectorSpy.called).to.be.false;
      } finally {
        observerSpy.restore();
        detectorSpy.restore();
      }
    });
  });

  describe('isPartTargeted', () => {
    it('should return false when no rule targets a given name', () => {
      const name = uniqueName('not-targeted');
      expect(isPartTargeted(name)).to.be.false;
    });

    it('should detect a part declared in a <style> in document head', async () => {
      const name = uniqueName('start-style');
      addStyle(`vaadin-grid::part(${name}) {}`);
      await nextRender();
      expect(isPartTargeted(name)).to.be.true;
    });

    it('should detect a part declared in an adopted stylesheet on document', async () => {
      const name = uniqueName('start-adopted');
      addAdopted(`::part(${name}) {}`);
      // Adopted sheets are not seen by the MutationObserver; piggy-back on a
      // DOM stylesheet add to trigger a rescan that walks adopted sheets too.
      addStyle('/* trigger rescan */');
      await nextRender();
      expect(isPartTargeted(name)).to.be.true;
    });

    it('should accept whitespace inside ::part(...)', async () => {
      const name = uniqueName('whitespace');
      addStyle(`::part(  ${name}  ) {}`);
      await nextRender();
      expect(isPartTargeted(name)).to.be.true;
    });

    it('should detect every name in a comma-separated selector list', async () => {
      const a = uniqueName('multi-a');
      const b = uniqueName('multi-b');
      addStyle(`::part(${a}), ::part(${b}) { color: red; }`);
      await nextRender();
      expect(isPartTargeted(a)).to.be.true;
      expect(isPartTargeted(b)).to.be.true;
    });

    it('should detect a part nested in @media', async () => {
      const name = uniqueName('nested-media');
      addStyle(`@media all { ::part(${name}) {} }`);
      await nextRender();
      expect(isPartTargeted(name)).to.be.true;
    });

    it('should detect a part declared in a sheet imported via @import', async () => {
      const name = uniqueName('imported');
      const importedCss = `::part(${name}) {}`;
      const importedUrl = `data:text/css;base64,${btoa(importedCss)}`;
      const style = addStyle(`@import url('${importedUrl}');`);
      // Wait for the imported sheet to load, then a rescan tick.
      while (!style.sheet || style.sheet.cssRules.length === 0 || !style.sheet.cssRules[0].styleSheet) {
        await new Promise((r) => {
          setTimeout(r, 20);
        });
      }
      // Trigger a rescan that also walks the imported sheet's rules.
      addStyle('/* trigger rescan */');
      await nextRender();
      expect(isPartTargeted(name)).to.be.true;
    });

    it('should not detect a name that was never declared even after scanning many sheets', () => {
      addStyle('::part(other) {}');
      addAdopted('::part(another) {}');
      const name = uniqueName('truly-absent');
      expect(isPartTargeted(name)).to.be.false;
    });
  });

  describe('lazy stylesheet additions via MutationObserver', () => {
    it('should detect a part in a <style> appended to document after init', async () => {
      const name = uniqueName('lazy-style');
      expect(isPartTargeted(name)).to.be.false;
      addStyle(`::part(${name}) {}`);
      await nextRender();
      expect(isPartTargeted(name)).to.be.true;
    });

    it('should detect a part in a <link rel="stylesheet"> that loads asynchronously', async () => {
      const name = uniqueName('lazy-link');
      expect(isPartTargeted(name)).to.be.false;

      const css = `::part(${name}) {}`;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `data:text/css;base64,${btoa(css)}`;
      document.head.appendChild(link);
      addedDomSheets.push(link);

      if (!link.sheet) {
        await new Promise((r) => {
          link.addEventListener('load', r, { once: true });
        });
      }
      await nextRender();
      expect(isPartTargeted(name)).to.be.true;
    });

    it('should not detect a part inside a preload <link> (its content does not enter document.styleSheets)', async () => {
      const name = uniqueName('non-stylesheet-link');
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = `data:text/css;base64,${btoa(`::part(${name}) {}`)}`;
      document.head.appendChild(link);
      addedDomSheets.push(link);
      await nextRender();
      // Even though the tracker subscribes to the link's load event, the
      // preloaded resource is never applied as a stylesheet, so it does not
      // appear in document.styleSheets and the part is not registered.
      expect(isPartTargeted(name)).to.be.false;
    });

    it('should ignore non-style elements added to the DOM', async () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      addedDomSheets.push(div);
      await nextRender();
      // No assertion needed beyond "doesn't throw, no warning".
      expect(warnStub.called).to.be.false;
    });

    it('should not throw when text nodes are added to the DOM', async () => {
      const text = document.createTextNode('hello');
      document.body.appendChild(text);
      addedDomSheets.push(text);
      await nextRender();
      expect(warnStub.called).to.be.false;
    });

    it('should rescan when a deferred-sheet <link> finally loads', async () => {
      // A <link rel="stylesheet"> without an href has a null `sheet` at the
      // time the MutationObserver callback runs, so the tracker subscribes to
      // its `load` event. When the load event eventually fires (here we
      // dispatch it synthetically), the rescan should pick up content that
      // was registered between observer-time and load-time.
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      addedDomSheets.push(link);
      await nextRender();

      // Simulate "stylesheet content arrived after load" by adopting a sheet
      // that contains the rule. The rescan triggered by the link's load event
      // walks adoptedStyleSheets and picks it up.
      const name = uniqueName('deferred-load');
      addAdopted(`::part(${name}) {}`);

      link.dispatchEvent(new Event('load'));
      await nextRender();

      expect(isPartTargeted(name)).to.be.true;
    });
  });

  describe('registerPartTrackingHost', () => {
    it('should retro-fit a matching descendant with the part attribute when its rule is added later', async () => {
      const host = makeHost();
      registerPartTrackingHost(host);
      const name = uniqueName('retro-fit');
      const child = addChildWithClass(host, name);
      expect(child.part.contains(name)).to.be.false;

      addStyle(`::part(${name}) {}`);
      await nextRender();

      expect(child.part.contains(name)).to.be.true;
      unregisterPartTrackingHost(host);
    });

    it('should retro-fit multiple newly-targeted parts in a single rescan', async () => {
      const host = makeHost();
      registerPartTrackingHost(host);
      const a = uniqueName('multi-retro-a');
      const b = uniqueName('multi-retro-b');
      const childA = addChildWithClass(host, a);
      const childB = addChildWithClass(host, b);

      addStyle(`::part(${a}) {} ::part(${b}) {}`);
      await nextRender();

      expect(childA.part.contains(a)).to.be.true;
      expect(childB.part.contains(b)).to.be.true;
      unregisterPartTrackingHost(host);
    });

    it('should retro-fit every descendant matching the class, not just one', async () => {
      const host = makeHost();
      registerPartTrackingHost(host);
      const name = uniqueName('multi-cells');
      const c1 = addChildWithClass(host, name);
      const c2 = addChildWithClass(host, name);
      const c3 = addChildWithClass(host, name);

      addStyle(`::part(${name}) {}`);
      await nextRender();

      expect(c1.part.contains(name)).to.be.true;
      expect(c2.part.contains(name)).to.be.true;
      expect(c3.part.contains(name)).to.be.true;
      unregisterPartTrackingHost(host);
    });

    it('should not retro-fit unregistered hosts', async () => {
      const host = makeHost();
      registerPartTrackingHost(host);
      unregisterPartTrackingHost(host);
      const name = uniqueName('not-retro');
      const child = addChildWithClass(host, name);

      addStyle(`::part(${name}) {}`);
      await nextRender();

      expect(child.part.contains(name)).to.be.false;
    });

    it('should not throw for hosts whose shadowRoot is null', async () => {
      const host = document.createElement('part-tracker-no-shadow-host');
      document.body.appendChild(host);
      registerPartTrackingHost(host);
      const name = uniqueName('no-shadow');
      addStyle(`::part(${name}) {}`);
      await nextRender();
      expect(warnStub.called).to.be.false;
      host.remove();
      unregisterPartTrackingHost(host);
    });

    it('should not retro-fit descendants whose class does not match any newly-targeted name', async () => {
      const host = makeHost();
      registerPartTrackingHost(host);
      const targeted = uniqueName('targeted');
      const unrelated = uniqueName('unrelated');
      const child = addChildWithClass(host, unrelated);

      addStyle(`::part(${targeted}) {}`);
      await nextRender();

      expect(child.part.contains(targeted)).to.be.false;
      expect(child.part.contains(unrelated)).to.be.false;
      unregisterPartTrackingHost(host);
    });
  });

  describe('cross-origin stylesheets', () => {
    function addUnreadableAdoptedSheet(href) {
      const sheet = new CSSStyleSheet();
      Object.defineProperty(sheet, 'cssRules', {
        get() {
          throw new Error('CORS-like access denied');
        },
        configurable: true,
      });
      Object.defineProperty(sheet, 'href', { value: href, configurable: true });
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
      addedAdoptedSheets.push(sheet);
      return sheet;
    }

    it('should warn (not throw) when a stylesheet throws on cssRules access', async () => {
      addUnreadableAdoptedSheet('https://example.com/styles.css');
      // Trigger a rescan via DOM mutation, since adoptedStyleSheets changes
      // are not observed.
      addStyle('/* dummy */');
      await nextRender();

      expect(warnStub.called).to.be.true;
      const message = warnStub.firstCall.args[0];
      expect(message).to.be.a('string');
      expect(message).to.include('cross-origin');
      expect(message).to.include('https://example.com/styles.css');
      expect(message).to.include('::part(');
    });

    it('should suggest a same-origin workaround in the warning', async () => {
      addUnreadableAdoptedSheet('https://example.com/styles.css');
      addStyle('/* dummy */');
      await nextRender();

      const message = warnStub.firstCall.args[0];
      expect(message).to.match(/same-origin/iu);
      expect(message).to.match(/empty bod(?:y|ies)/iu);
    });

    it('should warn at most once per unreadable stylesheet across multiple rescans', async () => {
      addUnreadableAdoptedSheet('https://example.com/once.css');
      addStyle('/* trigger 1 */');
      await nextRender();
      addStyle('/* trigger 2 */');
      await nextRender();
      addStyle('/* trigger 3 */');
      await nextRender();

      expect(warnStub.callCount).to.equal(1);
    });

    it('should still scan other readable stylesheets after encountering an unreadable one', async () => {
      addUnreadableAdoptedSheet('https://example.com/blocked.css');
      const name = uniqueName('after-blocked');
      addStyle(`::part(${name}) {}`);
      await nextRender();
      expect(isPartTargeted(name)).to.be.true;
    });

    it('should warn for sheets with no href as well', async () => {
      const sheet = new CSSStyleSheet();
      Object.defineProperty(sheet, 'cssRules', {
        get() {
          throw new Error('CORS');
        },
        configurable: true,
      });
      // No `href` defined — the warning should still produce a string.
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
      addedAdoptedSheets.push(sheet);
      addStyle('/* trigger */');
      await nextRender();
      expect(warnStub.called).to.be.true;
      expect(warnStub.firstCall.args[0]).to.be.a('string');
    });
  });

  describe('theme-changed integration', () => {
    it('should rescan when ThemeDetector fires theme-changed', async () => {
      const name = uniqueName('theme-rescan');
      // Adopted sheet that flips --vaadin-aura-theme AND declares ::part(name).
      // adoptedStyleSheets changes are NOT seen by the MutationObserver, so
      // any detection of `name` proves the theme-changed → rescan path ran.
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(`:root, :host { --vaadin-aura-theme: 1; } ::part(${name}) {}`);
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
      addedAdoptedSheets.push(sheet);

      await oneEvent(document.documentElement, 'transitionend');

      expect(isPartTargeted(name)).to.be.true;

      // Reset theme before next test by removing the sheet (afterEach handles it).
    });
  });

  describe('defensive paths', () => {
    it('should tolerate environments where document.adoptedStyleSheets is undefined', async () => {
      const original = Object.getOwnPropertyDescriptor(Document.prototype, 'adoptedStyleSheets');
      Object.defineProperty(document, 'adoptedStyleSheets', {
        configurable: true,
        get: () => undefined,
      });
      try {
        addStyle('/* trigger rescan */');
        await nextRender();
      } finally {
        delete document.adoptedStyleSheets;
        if (original) {
          Object.defineProperty(Document.prototype, 'adoptedStyleSheets', original);
        }
      }
      // The rescan should have completed without throwing on the missing
      // adopted-stylesheets list.
      expect(warnStub.called).to.be.false;
    });

    it('should skip retro-fit when CSS.escape throws on a part name', async () => {
      const host = makeHost();
      registerPartTrackingHost(host);
      const name = uniqueName('escape-fail');
      const child = addChildWithClass(host, name);
      const stub = sinon.stub(CSS, 'escape').throws(new Error('mock CSS.escape failure'));
      try {
        addStyle(`::part(${name}) {}`);
        // Wait just enough for the MutationObserver-driven rescan to run.
        await new Promise((r) => {
          setTimeout(r, 30);
        });
      } finally {
        stub.restore();
      }
      // Retro-fit selector construction failed — part attribute was not added.
      expect(child.part.contains(name)).to.be.false;
      unregisterPartTrackingHost(host);
    });
  });

  describe('caching', () => {
    it('should not re-inspect a sheet whose rules have already been read', async () => {
      const initialName = uniqueName('cache-initial');
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(`::part(${initialName}) {}`);
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
      addedAdoptedSheets.push(sheet);
      // First scan picks up the initial rule.
      addStyle('/* trigger initial scan */');
      await nextRender();
      expect(isPartTargeted(initialName)).to.be.true;

      // Mutate the same sheet to add a new ::part rule.
      const addedName = uniqueName('cache-added');
      sheet.insertRule(`::part(${addedName}) {}`);
      addStyle('/* trigger second scan */');
      await nextRender();

      // The new rule is NOT detected because the sheet is already in the
      // scanned-sheets cache. This is intentional (avoids re-walking large
      // sheets) and is the documented limitation of the tracker.
      expect(isPartTargeted(addedName)).to.be.false;
    });
  });

  describe('unregisterPartTrackingHost', () => {
    it('should be a no-op for a host that was never registered', () => {
      const host = makeHost();
      // Should not throw.
      unregisterPartTrackingHost(host);
    });

    it('should not retro-fit the host after unregistering', async () => {
      const host = makeHost();
      registerPartTrackingHost(host);
      const before = uniqueName('before-unreg');
      const after = uniqueName('after-unreg');
      const childBefore = addChildWithClass(host, before);
      const childAfter = addChildWithClass(host, after);

      addStyle(`::part(${before}) {}`);
      await nextRender();
      expect(childBefore.part.contains(before)).to.be.true;

      unregisterPartTrackingHost(host);

      addStyle(`::part(${after}) {}`);
      await nextRender();
      expect(childAfter.part.contains(after)).to.be.false;
    });
  });
});
