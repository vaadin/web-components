import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '@vaadin/tooltip';
import { Button } from '@vaadin/button';
import { Checkbox } from '@vaadin/checkbox';
import { ComboBox } from '@vaadin/combo-box';
import { CustomField } from '@vaadin/custom-field';
import { DatePicker } from '@vaadin/date-picker';
import { DateTimePicker } from '@vaadin/date-time-picker';
import { Details } from '@vaadin/details';
import { EmailField } from '@vaadin/email-field';
import { IntegerField } from '@vaadin/integer-field';
import { MessageInput } from '@vaadin/message-input';
import { MultiSelectComboBox } from '@vaadin/multi-select-combo-box';
import { NumberField } from '@vaadin/number-field';
import { PasswordField } from '@vaadin/password-field';
import { RadioGroup } from '@vaadin/radio-group';
import { Select } from '@vaadin/select';
import { Tab } from '@vaadin/tabs/vaadin-tab.js';
import { TextField } from '@vaadin/text-field';
import { TimePicker } from '@vaadin/time-picker';
import { mouseenter, mouseleave } from '@vaadin/tooltip/test/helpers.js';

[
  { tagName: Button.is },
  { tagName: Checkbox.is },
  { tagName: ComboBox.is, applyShouldNotShowCondition: (comboBox) => comboBox.click() },
  { tagName: CustomField.is },
  { tagName: DatePicker.is, applyShouldNotShowCondition: (datePicker) => datePicker.click() },
  { tagName: DateTimePicker.is, applyShouldNotShowCondition: (element) => element.querySelector('input').click() },
  { tagName: Details.is, targetSelector: '[part="summary"]', position: 'bottom-start' },
  { tagName: EmailField.is },
  { tagName: IntegerField.is },
  { tagName: MessageInput.is },
  { tagName: MultiSelectComboBox.is, applyShouldNotShowCondition: (comboBox) => comboBox.click() },
  { tagName: NumberField.is },
  { tagName: PasswordField.is },
  { tagName: RadioGroup.is },
  { tagName: Select.is },
  { tagName: Tab.is },
  { tagName: TextField.is },
  { tagName: TimePicker.is, applyShouldNotShowCondition: (timePicker) => timePicker.click() },
].forEach(({ tagName, targetSelector, position, applyShouldNotShowCondition }) => {
  describe(`${tagName} with a slotted tooltip`, () => {
    let element, tooltip, tooltipOverlay;

    beforeEach(() => {
      element = fixtureSync(`
        <${tagName}>
          <vaadin-tooltip slot="tooltip" text="Tooltip text"></vaadin-tooltip>
        </${tagName}>
      `);
      tooltip = element.querySelector('vaadin-tooltip');
      tooltipOverlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');
    });

    it('should set tooltip target', () => {
      const target = targetSelector ? element.shadowRoot.querySelector(targetSelector) : element;
      expect(tooltip.target).to.equal(target);
    });

    it('should set tooltip position', () => {
      expect(tooltip.position).to.equal(position || 'bottom');
    });

    it('should or should not show tooltip', () => {
      mouseenter(tooltip.target);
      expect(tooltipOverlay.opened).to.be.true;
      mouseleave(tooltip.target);

      if (applyShouldNotShowCondition) {
        applyShouldNotShowCondition(element);

        mouseenter(tooltip.target);
        expect(tooltipOverlay.opened).to.be.false;
      }
    });
  });
});
