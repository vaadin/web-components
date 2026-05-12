import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.toggleSwitchComponent = true;

import '../src/vaadin-toggle-switch.js';
import type { ToggleSwitch } from '../src/vaadin-toggle-switch.js';

type Target = 'host' | 'switch' | 'thumb' | 'label';

interface PropTest {
  prop: string;
  override: string;
  target: Target;
  read(style: CSSStyleDeclaration): string;
  // When true the test sets `checked` before reading the computed style.
  checked?: boolean;
}

const TESTS: PropTest[] = [
  {
    prop: '--vaadin-toggle-switch-size',
    override: '32px',
    target: 'switch',
    read: (s) => s.height,
  },
  {
    prop: '--vaadin-toggle-switch-track-width',
    override: '80px',
    target: 'switch',
    read: (s) => s.width,
  },
  {
    prop: '--vaadin-toggle-switch-thumb-size',
    override: '20px',
    target: 'thumb',
    read: (s) => s.width,
  },
  {
    prop: '--vaadin-toggle-switch-background',
    override: 'rgb(255, 0, 0)',
    target: 'switch',
    read: (s) => s.backgroundColor,
  },
  {
    prop: '--vaadin-toggle-switch-border-color',
    override: 'rgb(0, 128, 0)',
    target: 'switch',
    read: (s) => s.borderColor || s.borderTopColor,
  },
  {
    prop: '--vaadin-toggle-switch-border-width',
    override: '3px',
    target: 'switch',
    read: (s) => s.borderTopWidth,
  },
  {
    prop: '--vaadin-toggle-switch-gap',
    override: '24px',
    target: 'host',
    read: (s) => s.columnGap,
  },
  {
    prop: '--vaadin-toggle-switch-thumb-color',
    override: 'rgb(123, 45, 67)',
    target: 'thumb',
    read: (s) => s.backgroundColor,
  },
  {
    prop: '--vaadin-toggle-switch-thumb-checked-color',
    override: 'rgb(11, 22, 33)',
    target: 'thumb',
    checked: true,
    read: (s) => s.backgroundColor,
  },
  {
    prop: '--vaadin-toggle-switch-label-color',
    override: 'rgb(50, 60, 70)',
    target: 'label',
    read: (s) => s.color,
  },
  {
    prop: '--vaadin-toggle-switch-label-font-size',
    override: '23px',
    target: 'label',
    read: (s) => s.fontSize,
  },
  {
    prop: '--vaadin-toggle-switch-label-font-weight',
    override: '900',
    target: 'label',
    read: (s) => s.fontWeight,
  },
  {
    prop: '--vaadin-toggle-switch-label-line-height',
    override: '37px',
    target: 'label',
    read: (s) => s.lineHeight,
  },
];

describe('toggle-switch styles', () => {
  describe('CSS custom properties', () => {
    let element: ToggleSwitch;

    beforeEach(async () => {
      element = fixtureSync('<vaadin-toggle-switch label="Toggle"></vaadin-toggle-switch>');
      await nextRender();
    });

    function getTarget(target: Target): Element {
      if (target === 'host') {
        return element;
      }
      const part = element.shadowRoot!.querySelector(`[part='${target}']`);
      expect(part, `expected shadow part [part='${target}']`).to.exist;
      return part!;
    }

    TESTS.forEach(({ prop, override, target, read, checked }) => {
      it(`should apply ${prop} to [${target}]`, async () => {
        if (checked) {
          element.checked = true;
          await nextRender();
        }

        const node = getTarget(target);
        const before = read(getComputedStyle(node));
        element.style.setProperty(prop, override);
        await nextRender();
        const after = read(getComputedStyle(node));

        expect(after).to.not.equal(before);
        expect(after).to.equal(override);
      });
    });
  });
});
