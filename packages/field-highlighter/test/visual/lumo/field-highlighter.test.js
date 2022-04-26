import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/checkbox/theme/lumo/vaadin-checkbox.js';
import '@vaadin/checkbox-group/theme/lumo/vaadin-checkbox-group.js';
import '@vaadin/date-time-picker/theme/lumo/vaadin-date-time-picker.js';
import '@vaadin/item/theme/lumo/vaadin-item.js';
import '@vaadin/list-box/theme/lumo/vaadin-list-box.js';
import '@vaadin/radio-group/theme/lumo/vaadin-radio-group.js';
import '@vaadin/text-area/theme/lumo/vaadin-text-area.js';
import '@vaadin/text-field/theme/lumo/vaadin-text-field.js';
import '../../../theme/lumo/vaadin-field-highlighter.js';
import { setUsers } from '../common.js';

describe('field-highlighter', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '20px';
    div.style.height = '150px';
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

    it('focused', async () => {
      await sendKeys({ press: 'Tab' });
      await nextFrame();
      await visualDiff(div, 'text-field-focused');
    });
  });
});
