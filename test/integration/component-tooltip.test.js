import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouse } from '@vaadin/test-runner-commands';
import { fixtureSync, middleOfNode, nextRender, tabKeyDown } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import { Button } from '@vaadin/button';
import { Checkbox } from '@vaadin/checkbox';
import { CheckboxGroup } from '@vaadin/checkbox-group';
import { ComboBox } from '@vaadin/combo-box';
import { CustomField } from '@vaadin/custom-field';
import { DatePicker } from '@vaadin/date-picker';
import { DateTimePicker } from '@vaadin/date-time-picker';
import { Details } from '@vaadin/details';
import { EmailField } from '@vaadin/email-field';
import { Icon } from '@vaadin/icon';
import { IntegerField } from '@vaadin/integer-field';
import { ListBox } from '@vaadin/list-box';
import { MessageInput } from '@vaadin/message-input';
import { MultiSelectComboBox } from '@vaadin/multi-select-combo-box';
import { NumberField } from '@vaadin/number-field';
import { PasswordField } from '@vaadin/password-field';
import { RadioGroup } from '@vaadin/radio-group';
import { Select } from '@vaadin/select';
import { Tab } from '@vaadin/tabs/vaadin-tab.js';
import { TextArea } from '@vaadin/text-area';
import { TextField } from '@vaadin/text-field';
import { TimePicker } from '@vaadin/time-picker';
import { Tooltip } from '@vaadin/tooltip';
import { mouseenter, mouseleave } from '@vaadin/tooltip/test/helpers.js';

before(() => {
  Tooltip.setDefaultFocusDelay(0);
  Tooltip.setDefaultHoverDelay(0);
  Tooltip.setDefaultHideDelay(0);
});

[
  { tagName: Button.is },
  { tagName: Checkbox.is, ariaTargetSelector: 'input' },
  { tagName: CheckboxGroup.is },
  {
    tagName: ComboBox.is,
    position: 'top',
    ariaTargetSelector: 'input',
    applyShouldNotShowCondition: (comboBox) => comboBox.click(),
  },
  {
    tagName: CustomField.is,
    children: '<vaadin-combo-box></vaadin-combo-box>',
    applyShouldNotShowCondition: (field) => field.inputs[0].click(),
  },
  {
    tagName: DatePicker.is,
    position: 'top',
    ariaTargetSelector: 'input',
    applyShouldNotShowCondition: (datePicker) => datePicker.click(),
  },
  {
    tagName: DateTimePicker.is,
    position: 'top',
    applyShouldNotShowCondition: (element) => element.querySelector('input').click(),
  },
  {
    tagName: Details.is,
    children: '<vaadin-details-summary slot="summary"></vaadin-details-summary>',
    targetSelector: '[slot="summary"]',
    position: 'bottom-start',
  },
  { tagName: EmailField.is, position: 'top', ariaTargetSelector: 'input' },
  { tagName: Icon.is },
  { tagName: IntegerField.is, position: 'top', ariaTargetSelector: 'input' },
  { tagName: ListBox.is },
  { tagName: MessageInput.is },
  {
    tagName: MultiSelectComboBox.is,
    position: 'top',
    ariaTargetSelector: 'input',
    applyShouldNotShowCondition: (comboBox) => comboBox.click(),
  },
  { tagName: NumberField.is, position: 'top', ariaTargetSelector: 'input' },
  { tagName: PasswordField.is, position: 'top', ariaTargetSelector: 'input' },
  { tagName: RadioGroup.is },
  { tagName: Select.is, position: 'top', ariaTargetSelector: 'vaadin-select-value-button' },
  { tagName: Tab.is },
  { tagName: TextArea.is, position: 'top', ariaTargetSelector: 'textarea' },
  { tagName: TextField.is, position: 'top', ariaTargetSelector: 'input' },
  {
    tagName: TimePicker.is,
    position: 'top',
    ariaTargetSelector: 'input',
    applyShouldNotShowCondition: (timePicker) => timePicker.click(),
  },
].forEach(({ tagName, targetSelector, position, applyShouldNotShowCondition, ariaTargetSelector, children = '' }) => {
  describe(`${tagName} with a slotted tooltip`, () => {
    let element, tooltip, tooltipOverlay;

    beforeEach(() => {
      element = fixtureSync(`
        <${tagName}>
          ${children}
          <vaadin-tooltip slot="tooltip" text="Tooltip text"></vaadin-tooltip>
        </${tagName}>
      `);
      tooltip = element.querySelector('vaadin-tooltip');
      tooltipOverlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');
    });

    it('should set tooltip target', () => {
      const target = targetSelector ? element.querySelector(targetSelector) : element;
      expect(tooltip.target).to.equal(target);
    });

    if (ariaTargetSelector) {
      it('should set tooltip ariaTarget', () => {
        expect(tooltip.ariaTarget).to.equal(element.querySelector(ariaTargetSelector));
      });
    }

    it('should set tooltip overlay position', () => {
      expect(tooltipOverlay.position).to.equal(position || 'bottom');
    });

    it('should or should not show tooltip', async () => {
      mouseenter(tooltip.target);
      expect(tooltipOverlay.opened).to.be.true;
      mouseleave(tooltip.target);

      if (applyShouldNotShowCondition) {
        applyShouldNotShowCondition(element);
        await nextRender();

        mouseenter(tooltip.target);
        expect(tooltipOverlay.opened).to.be.false;
      }
    });
  });
});

[
  {
    tagName: ComboBox.is,
    setup: (comboBox) => {
      comboBox.items = [1, 2, 3];
    },
    open: (comboBox) => comboBox.open(),
  },
  {
    tagName: DatePicker.is,
    open: (datePicker) => datePicker.open(),
  },
  // DateTimePicker -> DatePicker
  {
    tagName: DateTimePicker.is,
    open: (dateTimePicker) => dateTimePicker.__datePicker.open(),
  },
  // DateTimePicker -> TimePicker
  {
    tagName: DateTimePicker.is,
    open: (dateTimePicker) => dateTimePicker.__timePicker.open(),
  },
  {
    tagName: TimePicker.is,
    open: (timePicker) => timePicker.open(),
  },
  {
    tagName: Select.is,
    setup: (select) => {
      select.items = [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
      ];
    },
    open: (select) => {
      select.opened = true;
    },
  },
].forEach(({ tagName, setup, open }) => {
  describe(`${tagName} overlay with slotted tooltip`, () => {
    let element, tooltip, tooltipOverlay;

    beforeEach(() => {
      element = fixtureSync(`
        <${tagName}>
          <vaadin-tooltip slot="tooltip" text="Tooltip text"></vaadin-tooltip>
        </${tagName}>
      `);
      if (setup) {
        setup(element);
      }
      tooltip = element.querySelector('vaadin-tooltip');
      tooltipOverlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');
    });

    it(`should close tooltip when opening ${tagName} overlay`, async () => {
      tabKeyDown(element);
      element.focus();
      expect(tooltipOverlay.opened).to.be.true;

      open(element);
      await nextRender();
      expect(tooltipOverlay.opened).to.be.false;
    });
  });
});

describe('accessible disabled button', () => {
  let button, tooltip;

  before(() => {
    window.Vaadin.featureFlags ??= {};
    window.Vaadin.featureFlags.accessibleDisabledButtons = true;
  });

  after(() => {
    window.Vaadin.featureFlags.accessibleDisabledButtons = false;
  });

  beforeEach(() => {
    button = fixtureSync(
      `<div>
        <vaadin-button disabled>
          Press me
          <vaadin-tooltip slot="tooltip" text="Tooltip text"></vaadin-tooltip>
        </vaadin-button>
        <input id="last-global-focusable" />
      </div>`,
    ).firstElementChild;
    tooltip = button.querySelector('vaadin-tooltip');
  });

  afterEach(async () => {
    await resetMouse();
  });

  it('should toggle tooltip on hover when button is disabled', async () => {
    const { x, y } = middleOfNode(button);
    await sendMouse({ type: 'move', position: [Math.floor(x), Math.floor(y)] });
    expect(tooltip._overlayElement.opened).to.be.true;

    await sendMouse({ type: 'move', position: [0, 0] });
    expect(tooltip._overlayElement.opened).to.be.false;
  });

  it('should toggle tooltip on focus when button is disabled', async () => {
    await sendKeys({ press: 'Tab' });
    expect(tooltip._overlayElement.opened).to.be.true;

    await sendKeys({ press: 'Tab' });
    expect(tooltip._overlayElement.opened).to.be.false;
  });
});
