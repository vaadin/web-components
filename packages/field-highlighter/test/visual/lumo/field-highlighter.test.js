import { sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, mousedown, nextFrame } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/props.css';
import '@vaadin/vaadin-lumo-styles/components/field-highlighter.css';
import '@vaadin/vaadin-lumo-styles/components/checkbox.css';
import '@vaadin/vaadin-lumo-styles/components/checkbox-group.css';
import '@vaadin/vaadin-lumo-styles/components/date-time-picker.css';
import '@vaadin/vaadin-lumo-styles/components/list-box.css';
import '@vaadin/vaadin-lumo-styles/components/item.css';
import '@vaadin/vaadin-lumo-styles/components/radio-group.css';
import '@vaadin/vaadin-lumo-styles/components/text-area.css';
import '@vaadin/vaadin-lumo-styles/components/text-field.css';
import '../common.js';
import '@vaadin/checkbox';
import '@vaadin/checkbox-group';
import '@vaadin/date-time-picker';
import '@vaadin/item';
import '@vaadin/list-box';
import '@vaadin/radio-group';
import '@vaadin/text-area';
import '@vaadin/text-field';
import '../../../vaadin-field-highlighter.js';
import { setUsers } from '../helpers.js';

describe('field-highlighter', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '20px';
    div.style.height = '150px';
  });

  afterEach(() => {
    // After tests which use sendKeys() the focus-utils.js -> isKeyboardActive is set to true.
    // Click once here on body to reset it so other tests are not affected by it.
    // An unwanted focus-ring would be shown in other tests otherwise.
    mousedown(document.body);
  });

  describe('checkbox', () => {
    beforeEach(async () => {
      element = fixtureSync(`<vaadin-checkbox label="I agree with terms"></vaadin-checkbox>`, div);
      setUsers(element);
      await nextFrame();
    });

    it('default', async () => {
      await visualDiff(div, 'checkbox');
    });

    it('focused', async () => {
      await sendKeys({ press: 'Tab' });
      await nextFrame();
      await visualDiff(div, 'checkbox-focused');
    });
  });

  describe('checkbox-group', () => {
    beforeEach(async () => {
      element = fixtureSync(
        `
          <vaadin-checkbox-group>
            <vaadin-checkbox name="user" value="1" label="Option 1"></vaadin-checkbox>
            <vaadin-checkbox name="user" value="2" label="Option 2"></vaadin-checkbox>
            <vaadin-checkbox name="user" value="3" label="Option 3"></vaadin-checkbox>
            <vaadin-checkbox name="user" value="4" label="Option 4"></vaadin-checkbox>
          </vaadin-checkbox-group>
        `,
        div,
      );
      setUsers(element);
      await nextFrame();
    });

    it('default', async () => {
      await visualDiff(div, 'checkbox-group');
    });

    it('focused', async () => {
      await sendKeys({ press: 'Tab' });
      await nextFrame();
      await visualDiff(div, 'checkbox-group-focused');
    });
  });

  describe('date-time-picker', () => {
    beforeEach(async () => {
      element = fixtureSync(`<vaadin-date-time-picker></vaadin-date-time-picker>`, div);
      setUsers(element);
      await nextFrame();
    });

    it('default', async () => {
      await visualDiff(div, 'date-time-picker');
    });

    it('focused', async () => {
      await sendKeys({ press: 'Tab' });
      await nextFrame();
      await visualDiff(div, 'date-time-picker-focused');
    });
  });

  describe('list-box', () => {
    beforeEach(async () => {
      div.style.height = '250px';
      element = fixtureSync(
        `
          <vaadin-list-box>
            <vaadin-item>Option one</vaadin-item>
            <vaadin-item>Option two</vaadin-item>
            <vaadin-item>Option three</vaadin-item>
            <vaadin-item>Option four</vaadin-item>
          </vaadin-list-box>
        `,
        div,
      );
      await nextFrame();
      setUsers(element);
      await nextFrame();
    });

    it('default', async () => {
      await visualDiff(div, 'list-box');
    });

    it('focused', async () => {
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Space' });
      await nextFrame();
      await visualDiff(div, 'list-box-focused');
    });
  });

  describe('radio-button', () => {
    beforeEach(async () => {
      element = fixtureSync(`<vaadin-radio-button label="I agree with terms"></vaadin-radio-button>`, div);
      setUsers(element);
      await nextFrame();
    });

    it('default', async () => {
      await visualDiff(div, 'radio-button');
    });

    it('focused', async () => {
      await sendKeys({ press: 'Tab' });
      await nextFrame();
      await visualDiff(div, 'radio-button-focused');
    });
  });

  describe('radio-group', () => {
    beforeEach(async () => {
      element = fixtureSync(
        `
          <vaadin-radio-group>
            <vaadin-radio-button name="user" value="1" label="Option 1"></vaadin-radio-button>
            <vaadin-radio-button name="user" value="2" label="Option 2"></vaadin-radio-button>
            <vaadin-radio-button name="user" value="3" label="Option 3"></vaadin-radio-button>
            <vaadin-radio-button name="user" value="4" label="Option 4"></vaadin-radio-button>
          </vaadin-radio-group>
        `,
        div,
      );
      setUsers(element);
      await nextFrame();
    });

    it('default', async () => {
      await visualDiff(div, 'radio-group');
    });

    it('focused', async () => {
      await sendKeys({ press: 'Tab' });
      await nextFrame();
      await visualDiff(div, 'radio-group-focused');
    });
  });

  describe('text-area', () => {
    beforeEach(async () => {
      div.style.height = '250px';
      element = fixtureSync(
        `
          <vaadin-text-area
            label="Text area"
            helper-text="Helper"
          ></vaadin-text-area>
        `,
        div,
      );
      setUsers(element);
      await nextFrame();
    });

    it('default', async () => {
      await visualDiff(div, 'text-area');
    });

    it('focused', async () => {
      await sendKeys({ press: 'Tab' });
      await nextFrame();
      await visualDiff(div, 'text-area-focused');
    });
  });

  describe('text-field', () => {
    beforeEach(async () => {
      element = fixtureSync(`<vaadin-text-field></vaadin-text-field>`, div);
      setUsers(element);
      await nextFrame();
    });

    it('default', async () => {
      await visualDiff(div, 'text-field');
    });

    it('focus-ring', async () => {
      await sendKeys({ press: 'Tab' });
      await nextFrame();
      await visualDiff(div, 'text-field-focus-ring');
    });

    it('pointer focus', async () => {
      await sendMouseToElement({ type: 'click', element });
      await visualDiff(div, 'text-field-pointer-focus');
    });
  });
});
