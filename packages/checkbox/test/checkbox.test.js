import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import { sendKeys } from '@web/test-runner-commands';
import { click, fixtureSync, mousedown, mouseup, nextFrame } from '@vaadin/testing-helpers';
import '../vaadin-checkbox.js';

describe('checkbox', () => {
  let checkbox, input, label, link;

  beforeEach(() => {
    checkbox = fixtureSync('<vaadin-checkbox>Checkbox with <a href="#">Terms & Conditions</a></vaadin-checkbox>');
    input = checkbox.inputElement;
    label = checkbox._labelNode;
    link = label.children[0];
  });

  // TODO: Will be tested with snapshot tests.
  // it('should define checkbox label using light DOM', () => {
  //   expect(label.childNodes[0].textContent).to.be.equal('Vaadin ');
  //   expect(label.childNodes[1].outerHTML).to.be.equal('<i>Checkbox</i>');
  // });

  // TODO: Will be tested with snapshot tests.
  // it('can be disabled imperatively', () => {
  //   checkbox.disabled = true;
  //   expect(input.hasAttribute('disabled')).to.be.true;
  // });

  // TODO: Will be tested with snapshot tests.
  // it('has default value "on"', () => {
  //   expect(checkbox.value).to.be.eql('on');
  // });

  it('fires click event', () => {
    const spy = sinon.spy();
    checkbox.addEventListener('click', spy);

    mousedown(checkbox);
    mouseup(checkbox);
    click(checkbox);

    expect(spy.calledOnce).to.be.true;
  });

  // TODO: Will be tested with snapshot tests.
  // it('should have proper name', () => {
  //   expect(checkbox.name).to.eq('');
  //   checkbox.checked = true;
  //   expect(checkbox.name).to.eq('test-checkbox');
  // });

  it('should have display: none when hidden', () => {
    checkbox.setAttribute('hidden', '');
    expect(getComputedStyle(checkbox).display).to.equal('none');
  });

  it('should toggle checked property on input click', () => {
    input.click();
    expect(checkbox.checked).to.be.true;

    input.click();
    expect(checkbox.checked).to.be.false;
  });

  it('should toggle checked property on label click', () => {
    label.click();
    expect(checkbox.checked).to.be.true;

    label.click();
    expect(checkbox.checked).to.be.false;
  });

  it('should not toggle checked property on label link click', () => {
    link.click();
    expect(checkbox.checked).to.be.false;
  });

  it('should not toggle checked property on click when disabled', () => {
    checkbox.disabled = true;
    checkbox.click();
    expect(checkbox.checked).to.be.false;
  });

  it('should reset indeterminate attribute on first click', () => {
    checkbox.indeterminate = true;
    expect(checkbox.indeterminate).to.be.true;

    checkbox.click();
    expect(checkbox.indeterminate).to.be.false;
  });

  // TODO: Out of the date
  // it('native checkbox should have the `presentation` role', () => {
  //   expect(input.getAttribute('role')).to.be.eql('presentation');
  // });

  // TODO: Out of the date
  // it('host should have the `checkbox` role', () => {
  //   expect(checkbox.getAttribute('role')).to.be.eql('checkbox');
  // });

  it('should set active attribute on input click', () => {
    mousedown(input);
    expect(checkbox.hasAttribute('active')).to.be.true;
  });

  it('should set active attribute when pressing Space on input', async () => {
    // Focus on the input
    await sendKeys({ press: 'Tab' });
    // Hold down Space on the input
    await sendKeys({ down: 'Space' });
    expect(checkbox.hasAttribute('active')).to.be.true;
  });

  it('should not set active attribute on label link click', () => {
    mousedown(link);
    expect(checkbox.hasAttribute('active')).to.be.false;
  });

  it('should be checked on Space when initially checked is false and indeterminate is true', async () => {
    checkbox.checked = false;
    checkbox.indeterminate = true;

    // Focus on the input
    await sendKeys({ press: 'Tab' });
    // Press Space on the input
    await sendKeys({ press: 'Space' });

    expect(checkbox.checked).to.be.true;
    expect(checkbox.indeterminate).to.be.false;
  });

  it('should not be checked on Space when initially checked is true and indeterminate is true', async () => {
    checkbox.checked = true;
    checkbox.indeterminate = true;

    // Focus on the input
    await sendKeys({ press: 'Tab' });
    // Press Space on the input
    await sendKeys({ press: 'Space' });

    expect(checkbox.checked).to.be.false;
    expect(checkbox.indeterminate).to.be.false;
  });

  it('should be checked on click when initially checked is false and indeterminate is true', () => {
    checkbox.checked = false;
    checkbox.indeterminate = true;
    checkbox.click();

    expect(checkbox.checked).to.be.true;
    expect(checkbox.indeterminate).to.be.false;
  });

  it('should not be checked on click when initially checked is true and indeterminate is true', () => {
    checkbox.checked = true;
    checkbox.indeterminate = true;
    checkbox.click();

    expect(checkbox.checked).to.be.false;
    expect(checkbox.indeterminate).to.be.false;
  });

  it('should remove has-label attribute when the label was cleared', async () => {
    label.innerHTML = '';
    await nextFrame();

    expect(checkbox.hasAttribute('has-input')).to.be.false;
  });

  describe('change event', () => {
    let changeSpy;

    beforeEach(() => {
      changeSpy = sinon.spy();
      checkbox.addEventListener('change', changeSpy);
    });

    it('should not fire change event when changing checked state programmatically', () => {
      checkbox.checked = true;

      expect(changeSpy.called).to.be.false;
    });

    it('should fire change event on input click', () => {
      input.click();
      expect(changeSpy.calledOnce).to.be.true;

      input.click();
      expect(changeSpy.calledTwice).to.be.true;
    });

    it('should fire change event on label click', () => {
      label.click();
      expect(changeSpy.calledOnce).to.be.true;

      label.click();
      expect(changeSpy.calledTwice).to.be.true;
    });

    it('should not fire change event on label link click', () => {
      link.click();
      expect(changeSpy.called).to.be.false;
    });

    it('should bubble', () => {
      checkbox.click();

      const event = changeSpy.firstCall.args[0];
      expect(event).to.have.property('bubbles', true);
    });

    it('should not be composed', () => {
      checkbox.click();

      const event = changeSpy.firstCall.args[0];
      expect(event).to.have.property('composed', false);
    });
  });
});

describe('has-label attribute', () => {
  let checkbox;

  beforeEach(() => {
    checkbox = fixtureSync('<vaadin-checkbox></vaadin-checkbox>');
  });

  it('should not set has-label attribute when label content is empty', () => {
    expect(checkbox.hasAttribute('has-label')).to.be.false;
  });

  it('should not set has-label attribute when only one empty text node added', async () => {
    const textNode = document.createTextNode(' ');
    checkbox.appendChild(textNode);
    await nextFrame();
    expect(checkbox.hasAttribute('has-label')).to.be.false;
  });

  it('should set has-label attribute when the label is added', async () => {
    const paragraph = document.createElement('p');
    paragraph.textContent = 'Added label';
    checkbox.appendChild(paragraph);
    await nextFrame();
    expect(checkbox.hasAttribute('has-label')).to.be.true;
  });
});
