import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, middleOfNode, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-switch.js';
import type { Switch } from '../src/vaadin-switch.js';

describe('vaadin-switch', () => {
  let element: Switch;
  let input: HTMLInputElement;

  beforeEach(async () => {
    element = fixtureSync('<vaadin-switch></vaadin-switch>');
    await nextRender();
    input = element.inputElement as HTMLInputElement;
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

    it('should make the slotted input at least 24px wide and high', () => {
      const rect = input.getBoundingClientRect();
      // Round, as Firefox and WebKit snap the size to a fraction below 24px
      expect(Math.round(rect.width)).to.be.at.least(24);
      expect(Math.round(rect.height)).to.be.at.least(24);
    });
  });

  describe('click target', () => {
    beforeEach(async () => {
      element.label = 'Label';
      element.style.width = '400px';
      await nextRender();
    });

    it('should cover the empty space next to the label with the input', () => {
      const label = element.querySelector('label')!;
      // Middle of the empty space between the label text and the host edge
      const x = (label.getBoundingClientRect().right + element.getBoundingClientRect().right) / 2;
      const { y } = middleOfNode(label);
      expect(document.elementFromPoint(x, y)).to.equal(input);
    });
  });
});
