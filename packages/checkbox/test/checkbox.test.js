import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { click, fixtureSync, mousedown, mouseup, nextFrame, space, spaceKeyDown } from '@vaadin/testing-helpers';
import '../vaadin-checkbox.js';

describe('checkbox', () => {
  let checkbox, nativeCheckbox, label;

  const down = (node) => {
    node.dispatchEvent(new CustomEvent('down'));
  };

  const up = (node) => {
    node.dispatchEvent(new CustomEvent('up'));
  };

  beforeEach(() => {
    checkbox = fixtureSync(
      '<vaadin-checkbox name="test-checkbox">Vaadin <i>Checkbox</i> with <a href="#">Terms &amp; Conditions</a></vaadin-checkbox>'
    );
    nativeCheckbox = checkbox._nativeCheckbox;
    label = checkbox.shadowRoot.querySelector('[part="label"]');
  });

  it('should define checkbox label using light DOM', () => {
    const slot = label.querySelector('slot');
    const nodes = slot.assignedNodes({ flatten: true });
    expect(nodes[0].textContent).to.be.equal('Vaadin ');
    expect(nodes[1].outerHTML).to.be.equal('<i>Checkbox</i>');
  });

  it('should have input as focusElement', () => {
    expect(checkbox.focusElement).to.be.eql(nativeCheckbox);
  });

  it('can be disabled imperatively', () => {
    checkbox.disabled = true;
    expect(nativeCheckbox.hasAttribute('disabled')).to.be.eql(true);
  });

  it('has default value "on"', () => {
    expect(checkbox.value).to.be.eql('on');
  });

  it('fires click event', () => {
    const spy = sinon.spy();
    checkbox.addEventListener('click', spy);

    mousedown(checkbox);
    mouseup(checkbox);
    click(checkbox);

    expect(spy.calledOnce).to.be.true;
  });

  it('should have proper name', () => {
    expect(checkbox.name).to.eq('');
    checkbox.checked = true;
    expect(checkbox.name).to.eq('test-checkbox');
  });

  it('should have display: none when hidden', () => {
    checkbox.setAttribute('hidden', '');
    expect(getComputedStyle(checkbox).display).to.equal('none');
  });

  it('should toggle on host click', () => {
    checkbox.click();

    expect(checkbox.checked).to.be.true;

    checkbox.click();

    expect(checkbox.checked).to.be.false;
  });

  it('should not toggle on link inside host click', () => {
    const slot = label.querySelector('slot');
    const link = slot.assignedNodes({ flatten: true })[3];
    expect(link.outerHTML).to.be.equal('<a href="#">Terms &amp; Conditions</a>');
    link.click();
    expect(checkbox.checked).to.be.false;
  });

  it('should not toggle on click when disabled', () => {
    checkbox.disabled = true;
    label.click();
    expect(checkbox.checked).to.be.false;
  });

  it('should bind checked to the native checkbox and vice versa', () => {
    checkbox.checked = true;
    expect(nativeCheckbox.checked).to.be.eql(true);

    nativeCheckbox.checked = false;
    nativeCheckbox.dispatchEvent(new CustomEvent('change'));
    expect(checkbox.checked).to.be.eql(false);
  });

  it('should bind indeterminate to the native checkbox and vice versa', () => {
    checkbox.indeterminate = true;
    expect(nativeCheckbox.indeterminate).to.be.eql(true);

    nativeCheckbox.indeterminate = false;
    nativeCheckbox.dispatchEvent(new CustomEvent('change'));
    expect(checkbox.indeterminate).to.be.eql(false);
  });

  it('should set indeterminate to false when clicked the first time', () => {
    checkbox.indeterminate = true;

    checkbox.click();

    expect(checkbox.indeterminate).to.be.false;
  });

  it('native checkbox should have the `presentation` role', () => {
    expect(nativeCheckbox.getAttribute('role')).to.be.eql('presentation');
  });

  it('host should have the `checkbox` role', () => {
    expect(checkbox.getAttribute('role')).to.be.eql('checkbox');
  });

  it('should have active attribute on down', () => {
    down(checkbox);

    expect(checkbox.hasAttribute('active')).to.be.true;
  });

  it('should not have active attribute after up', () => {
    down(checkbox);

    up(checkbox);

    expect(checkbox.hasAttribute('active')).to.be.false;
  });

  it('should have active attribute on space', () => {
    spaceKeyDown(checkbox);

    expect(checkbox.hasAttribute('active')).to.be.true;
  });

  it('should not have active attribute after space', () => {
    space(checkbox);

    expect(checkbox.hasAttribute('active')).to.be.false;
  });

  it('should be checked after space when initially checked is false and indeterminate is true', () => {
    checkbox.checked = false;
    checkbox.indeterminate = true;

    space(checkbox);

    expect(checkbox.checked).to.be.true;
    expect(checkbox.indeterminate).to.be.false;
    expect(checkbox.getAttribute('aria-checked')).to.be.eql('true');
  });

  it('should not be checked after space when initially checked is true and indeterminate is true', () => {
    checkbox.checked = true;
    checkbox.indeterminate = true;

    space(checkbox);

    expect(checkbox.checked).to.be.false;
    expect(checkbox.indeterminate).to.be.false;
    expect(checkbox.getAttribute('aria-checked')).to.be.eql('false');
  });

  it('should be checked after click when initially checked is false and indeterminate is true', () => {
    checkbox.checked = false;
    checkbox.indeterminate = true;

    checkbox.click();

    expect(checkbox.checked).to.be.true;
    expect(checkbox.indeterminate).to.be.false;
    expect(checkbox.getAttribute('aria-checked')).to.be.eql('true');
  });

  it('should not be checked after click when initially checked is true and indeterminate is true', () => {
    checkbox.checked = true;
    checkbox.indeterminate = true;

    checkbox.click();

    expect(checkbox.checked).to.be.false;
    expect(checkbox.indeterminate).to.be.false;
    expect(checkbox.getAttribute('aria-checked')).to.be.eql('false');
  });

  it('should set empty attribute on part label when the label was removed', async () => {
    while (checkbox.firstChild) {
      checkbox.removeChild(checkbox.firstChild);
    }

    await nextFrame();

    expect(label.hasAttribute('empty')).to.be.true;
  });

  describe('change event', () => {
    let changeSpy;

    beforeEach(() => {
      changeSpy = sinon.spy();
      checkbox.addEventListener('change', changeSpy);
    });

    it('should not fire change-event when changing checked value programmatically', () => {
      checkbox.checked = true;

      expect(changeSpy.called).to.be.false;
    });

    it('should fire change-event when user checks the element', () => {
      checkbox.click();

      expect(changeSpy.calledOnce).to.be.true;
    });

    it('should fire change-event when user unchecks the element', () => {
      checkbox.checked = true;
      checkbox.click();

      expect(changeSpy.calledOnce).to.be.true;
    });

    it('should bubble', () => {
      checkbox.click();

      const event = changeSpy.getCall(0).args[0];
      expect(event).to.have.property('bubbles', true);
    });

    it('should not be composed', () => {
      checkbox.click();

      const event = changeSpy.getCall(0).args[0];
      expect(event).to.have.property('composed', false);
    });
  });
});

describe('empty label', () => {
  let checkbox, label;

  beforeEach(() => {
    checkbox = fixtureSync('<vaadin-checkbox></vaadin-checkbox>');
    label = checkbox.shadowRoot.querySelector('[part="label"]');
  });

  it('should set empty attribute on part label when there is no label', () => {
    expect(label.hasAttribute('empty')).to.be.true;
  });

  it('should set empty attribute on part label when there is only one empty text node added', async () => {
    const textNode = document.createTextNode(' ');
    checkbox.appendChild(textNode);
    await nextFrame();
    expect(label.hasAttribute('empty')).to.be.true;
  });

  it('should remove empty attribute from part label when the label is added', async () => {
    const paragraph = document.createElement('p');
    paragraph.textContent = 'Added label';
    checkbox.appendChild(paragraph);
    await nextFrame();
    expect(label.hasAttribute('empty')).to.be.false;
  });
});
