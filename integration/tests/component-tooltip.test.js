import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '@vaadin/tooltip';
import { Button } from '@vaadin/button';
import { Checkbox } from '@vaadin/checkbox';
import { Details } from '@vaadin/details';
import { EmailField } from '@vaadin/email-field';
import { PasswordField } from '@vaadin/password-field';
import { Select } from '@vaadin/select';
import { Tab } from '@vaadin/tabs/vaadin-tab.js';
import { TextField } from '@vaadin/text-field';
import { TimePicker } from '@vaadin/time-picker';

[
  { tagName: Button.is },
  { tagName: Checkbox.is },
  { tagName: Details.is, targetSelector: '[part="summary"]', position: 'bottom-start' },
  { tagName: EmailField.is },
  { tagName: PasswordField.is },
  { tagName: Select.is },
  { tagName: Tab.is },
  { tagName: TextField.is },
  { tagName: TimePicker.is },
].forEach(({ tagName, targetSelector, position }) => {
  describe(`${tagName} with a slotted tooltip`, () => {
    let element, tooltip;

    beforeEach(() => {
      element = fixtureSync(`
        <${tagName}>
          <vaadin-tooltip slot="tooltip" text="Tooltip text"></vaadin-tooltip>
        </${tagName}>
      `);
      tooltip = element.querySelector('vaadin-tooltip');
    });

    it('should set tooltip target', () => {
      const target = targetSelector ? element.shadowRoot.querySelector(targetSelector) : element;
      expect(tooltip.target).to.equal(target);
    });

    it('should set tooltip position', () => {
      expect(tooltip.position).to.equal(position || 'bottom');
    });
  });
});
