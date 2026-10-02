import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';

describe('form-controls', () => {
  let wrapper, controls;

  beforeEach(() => {
    wrapper = fixtureSync(`
      <div style="display: inline-grid; grid-template-columns: auto auto; align-items: center; gap: 10px; padding: 10px">
        <input placeholder="Placeholder" />
        <input value="Value" />
        <input value="Read-only" readonly />
        <input value="Disabled" disabled />
        <select>
          <option>Option</option>
        </select>
        <textarea>Text area</textarea>
        <button>Button</button>
        <button disabled>Disabled</button>
        <input type="file" />
        <span>
          <input type="checkbox" checked />
          <input type="checkbox" />
          <input type="radio" checked />
          <input type="radio" />
        </span>
        <input type="range" />
        <progress value="0.5"></progress>
      </div>
    `);
    controls = [...wrapper.querySelectorAll('input, select, textarea, button, progress')];
  });

  it('default', async () => {
    wrapper.classList.add('vaadin-themed-html');
    await visualDiff(wrapper, 'form-controls-default');
  });

  it('class on the controls', async () => {
    controls.forEach((control) => control.classList.add('vaadin-themed-html'));
    await visualDiff(wrapper, 'form-controls-class-on-controls');
  });

  it('without the class', async () => {
    await visualDiff(wrapper, 'form-controls-without-class');
  });

  it('opted out', async () => {
    wrapper.classList.add('vaadin-themed-html');
    controls.forEach((control) => control.classList.add('vaadin-unthemed-html'));
    await visualDiff(wrapper, 'form-controls-opted-out');
  });

  it('focus-visible', async () => {
    wrapper.classList.add('vaadin-themed-html');
    await sendKeys({ press: 'Tab' });
    await visualDiff(wrapper, 'form-controls-focus-visible');
  });

  [
    ['button', 'button'],
    ['file', '[type="file"]'],
    ['radio', '[type="radio"]'],
  ].forEach(([name, selector]) => {
    it(`focus-visible ${name}`, async () => {
      wrapper.classList.add('vaadin-themed-html');
      // Keyboard interaction first, so that the programmatic focus is focus-visible
      await sendKeys({ press: 'Tab' });
      wrapper.querySelector(selector).focus();
      await visualDiff(wrapper, `form-controls-focus-visible-${name}`);
    });
  });

  it('disabled file input', async () => {
    wrapper.classList.add('vaadin-themed-html');
    wrapper.querySelector('[type="file"]').disabled = true;
    await visualDiff(wrapper, 'form-controls-disabled-file');
  });

  it('user-invalid', async () => {
    wrapper.classList.add('vaadin-themed-html');
    const input = controls[1];
    input.value = '';
    input.required = true;
    input.focus();
    await sendKeys({ type: 'a' });
    await sendKeys({ press: 'Backspace' });
    input.blur();
    await visualDiff(wrapper, 'form-controls-user-invalid');
  });

  it('slotted input of a component', async () => {
    wrapper.classList.add('vaadin-themed-html');
    controls.forEach((control) =>
      control.setAttribute('slot', control.localName === 'textarea' ? 'textarea' : 'input'),
    );
    await visualDiff(wrapper, 'form-controls-slotted');
  });
});
