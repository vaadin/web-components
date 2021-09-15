import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../vaadin-time-picker.js';

describe('helper text', () => {
  let timePicker;

  beforeEach(() => {
    timePicker = fixtureSync(`<vaadin-time-picker></vaadin-time-picker>`);
  });

  it('should set helper text content using helperText property', async () => {
    timePicker.helperText = 'foo';
    await nextFrame();
    expect(timePicker.querySelector('[slot="helper"]').textContent).to.eql('foo');
  });

  it('should display the helper text when slotted helper available', async () => {
    const helper = document.createElement('div');
    helper.setAttribute('slot', 'helper');
    helper.textContent = 'foo';
    timePicker.appendChild(helper);
    await nextFrame();
    expect(timePicker.querySelector('[slot="helper"]').textContent).to.eql('foo');
  });
});
