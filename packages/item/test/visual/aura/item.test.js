import { resetMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../../vaadin-item.js';

describe('item', () => {
  let div, element;

  function setIconVisible(container) {
    container.style.setProperty('--vaadin-item-checkmark-display', 'block');
  }

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-item>Basic item</vaadin-item>', div);
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('checkmark', async () => {
    setIconVisible(div);
    await visualDiff(div, 'checkmark');
  });

  it('selected', async () => {
    setIconVisible(div);
    element.setAttribute('selected', '');
    await visualDiff(div, 'selected');
  });

  it('focused', async () => {
    setIconVisible(div);
    element.setAttribute('focused', '');
    await visualDiff(div, 'focused');
  });

  it('disabled', async () => {
    setIconVisible(div);
    element.setAttribute('disabled', '');
    await visualDiff(div, 'disabled');
  });

  describe('theme', () => {
    beforeEach(() => {
      setIconVisible(div);
      element.setAttribute('selected', '');
    });

    afterEach(async () => {
      await resetMouse();
    });

    it('accent-red', async () => {
      element.classList.add('aura-accent-red');
      await visualDiff(div, 'accent-red');
    });

    it('filled', async () => {
      element.setAttribute('theme', 'filled');
      await sendMouseToElement({ type: 'move', element });
      await visualDiff(div, 'theme-filled');
    });

    it('accent-red filled', async () => {
      element.setAttribute('theme', 'filled');
      element.classList.add('aura-accent-red');
      await sendMouseToElement({ type: 'move', element });
      await visualDiff(div, 'accent-red-filled');
    });
  });
});
