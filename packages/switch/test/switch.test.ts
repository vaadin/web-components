import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-switch.js';
import type { Switch } from '../src/vaadin-switch.js';

describe('vaadin-switch', () => {
  let element: Switch;

  beforeEach(async () => {
    element = fixtureSync('<vaadin-switch></vaadin-switch>');
    await nextRender();
  });

  describe('custom element definition', () => {
    let tagName: string;

    beforeEach(() => {
      tagName = element.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect((customElements.get(tagName) as any).is).to.equal(tagName);
    });
  });

  describe('input styles', () => {
    let input: HTMLInputElement;

    beforeEach(() => {
      input = element.inputElement as HTMLInputElement;
    });

    it('should apply opacity: 0 on the slotted input', () => {
      // Emulate CSS normalize styles like used by Tailwind
      fixtureSync(`
        <style>
          input {
            opacity: 1;
          }
        </style>
      `);
      expect(getComputedStyle(input).opacity).to.equal('0');
    });

    it('should stretch the slotted input over the switch part', () => {
      // Emulate fixed size set by iOS UA styles or CSS resets
      fixtureSync(`
        <style>
          input {
            width: 1rem;
            height: 1rem;
          }
        </style>
      `);
      const inputRect = input.getBoundingClientRect();
      const partRect = element.shadowRoot!.querySelector("[part='switch']")!.getBoundingClientRect();
      expect(inputRect.width).to.be.at.least(partRect.width);
      expect(inputRect.height).to.be.at.least(partRect.height);
    });
  });
});
