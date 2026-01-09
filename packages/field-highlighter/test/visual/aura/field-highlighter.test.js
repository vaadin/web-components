import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, mousedown, nextFrame } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../common.js';
import '@vaadin/aura/aura.css';
import '@vaadin/text-field';
import '../../../src/vaadin-field-highlighter.js';
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
