import { expect } from '@esm-bundle/chai';
import { escKeyDown, fixtureSync, focusout, keyboardEventFor, mousedown, tabKeyDown } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-tooltip.js';
import { mouseenter, mouseleave } from './helpers.js';

describe('vaadin-tooltip', () => {
  let tooltip, overlay;

  beforeEach(() => {
    tooltip = fixtureSync('<vaadin-tooltip></vaadin-tooltip>');
    overlay = tooltip.shadowRoot.querySelector('vaadin-tooltip-overlay');
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = tooltip.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('overlay', () => {
    it('should not have tabindex on the overlay part', () => {
      expect(overlay.$.overlay.hasAttribute('tabindex')).to.be.false;
    });

    it('should propagate theme attribute to overlay', () => {
      tooltip.setAttribute('theme', 'foo');
      expect(overlay.getAttribute('theme')).to.equal('foo');
    });
  });

  describe('text', () => {
    it('should use text property as overlay text content', () => {
      tooltip.text = 'Foo';
      expect(overlay.textContent.trim()).to.equal('Foo');
    });

    it('should clear overlay content when text is set to null', () => {
      tooltip.text = 'Foo';
      tooltip.text = null;
      expect(overlay.textContent.trim()).to.equal('');
    });
  });

  describe('textGenerator', () => {
    it('should use textGenerator property to generate text content', () => {
      tooltip.textGenerator = () => 'Foo';
      expect(overlay.textContent.trim()).to.equal('Foo');
    });

    it('should override text property when textGenerator is set', () => {
      tooltip.text = 'Foo';
      tooltip.textGenerator = () => 'Bar';
      expect(overlay.textContent.trim()).to.equal('Bar');
    });

    it('should use context property in generator when provided', () => {
      tooltip.context = { text: 'Foo' };
      tooltip.textGenerator = (context) => context.text;
      expect(overlay.textContent.trim()).to.equal('Foo');
    });

    it('should update text content when context property changes', () => {
      tooltip.context = { text: 'Foo' };
      tooltip.textGenerator = (context) => context.text;

      tooltip.context = { text: 'Bar' };
      expect(overlay.textContent.trim()).to.equal('Bar');
    });
  });

  describe('target', () => {
    let target;

    beforeEach(() => {
      target = document.createElement('div');
      target.textContent = 'Target';
      document.body.appendChild(target);
    });

    afterEach(() => {
      document.body.removeChild(target);
    });

    it('should set target as overlay positionTarget', () => {
      tooltip.target = target;
      expect(overlay.positionTarget).to.eql(target);
    });

    it('should set aria-describedby on the target element', () => {
      tooltip.target = target;
      expect(target.getAttribute('aria-describedby')).to.equal(overlay.id);
    });

    it('should retain existing aria-describedby attribute', () => {
      target.setAttribute('aria-describedby', 'foo');
      tooltip.target = target;

      expect(target.getAttribute('aria-describedby')).to.contain('foo');
      expect(target.getAttribute('aria-describedby')).to.contain(overlay.id);
    });

    it('should restore aria-describedby when clearing target', () => {
      target.setAttribute('aria-describedby', 'foo');
      tooltip.target = target;

      tooltip.target = null;
      expect(target.getAttribute('aria-describedby')).to.equal('foo');
    });
  });

  describe('for', () => {
    let target;

    beforeEach(() => {
      target = document.createElement('div');
      target.textContent = 'Target';
      document.body.appendChild(target);
    });

    afterEach(() => {
      document.body.removeChild(target);
    });

    describe('element found', () => {
      it('should use for attribute to link target using ID', () => {
        target.setAttribute('id', 'foo');
        tooltip.for = 'foo';
        expect(tooltip.target).to.eql(target);
      });
    });

    describe('element not found', () => {
      beforeEach(() => {
        sinon.stub(console, 'warn');
      });

      afterEach(() => {
        console.warn.restore();
      });

      it('should warn when element with given ID is not found', () => {
        tooltip.for = 'bar';
        expect(console.warn.called).to.be.true;
      });

      it('should keep the target when providing incorrect for', () => {
        tooltip.target = target;
        tooltip.for = 'bar';
        expect(tooltip.target).to.eql(target);
      });
    });
  });

  describe('auto open', () => {
    let target;

    beforeEach(() => {
      target = fixtureSync('<input>');
      tooltip.target = target;
    });

    it('should open overlay on target keyboard focus', () => {
      tabKeyDown(target);
      target.focus();
      expect(overlay.opened).to.be.true;
    });

    it('should not open overlay on target mouse focus', () => {
      mousedown(target);
      target.focus();
      expect(overlay.opened).to.be.false;
    });

    it('should close overlay on target focusout', () => {
      tabKeyDown(target);
      target.focus();
      focusout(target);
      expect(overlay.opened).to.be.false;
    });

    it('should open overlay on target mouseenter', () => {
      mouseenter(target);
      expect(overlay.opened).to.be.true;
    });

    it('should close overlay on target mouseleave', () => {
      mouseenter(target);
      mouseleave(target);
      expect(overlay.opened).to.be.false;
    });

    it('should close overlay on target mousedown', () => {
      mouseenter(target);
      mousedown(target);
      expect(overlay.opened).to.be.false;
    });

    it('should re-open overlay on subsequent mouseenter', () => {
      mouseenter(target);
      mousedown(target);

      mouseleave(target);
      mouseenter(target);
      expect(overlay.opened).to.be.true;
    });

    it('should not close overlay on mouseleave when target has focus', () => {
      mouseenter(target);
      tabKeyDown(target);
      target.focus();

      mouseleave(target);
      expect(overlay.opened).to.be.true;
    });

    it('should not close overlay on focusout when target has hover', () => {
      tabKeyDown(target);
      target.focus();
      mouseenter(target);

      focusout(target);
      expect(overlay.opened).to.be.true;
    });

    it('should close overlay on document Esc keydown', () => {
      mouseenter(target);
      escKeyDown(document.body);
      expect(overlay.opened).to.be.false;
    });

    it('should call stopImmediatePropagation for Esc keydown', () => {
      mouseenter(target);
      const event = keyboardEventFor('keydown', 27, [], 'Escape');
      const spy = sinon.spy(event, 'stopImmediatePropagation');
      target.dispatchEvent(event);
      expect(spy.calledOnce).to.be.true;
    });

    it('should not call stopImmediatePropagation when not opened', () => {
      mouseenter(target);
      mouseleave(target);
      const event = keyboardEventFor('keydown', 27, [], 'Escape');
      const spy = sinon.spy(event, 'stopImmediatePropagation');
      target.dispatchEvent(event);
      expect(spy.called).to.be.false;
    });

    it('should not open overlay on mouseenter when target is reset', () => {
      mouseenter(target);
      mouseleave(target);

      tooltip.target = null;
      mouseenter(target);
      expect(overlay.opened).to.be.false;
    });

    it('should not close overlay on mouseleave when target is reset', () => {
      mouseenter(target);

      tooltip.target = null;
      mouseleave(target);
      expect(overlay.opened).to.be.true;
    });

    it('should not open overlay on keyboard focus when target is reset', () => {
      mouseenter(target);
      mouseleave(target);

      tooltip.target = null;
      tabKeyDown(target);
      target.focus();
      expect(overlay.opened).to.be.false;
    });

    it('should not close overlay on mousedown when target is reset', () => {
      mouseenter(target);

      tooltip.target = null;
      mousedown(target);
      expect(overlay.opened).to.be.true;
    });

    it('should not close overlay on focusout when target is reset', () => {
      tabKeyDown(target);
      target.focus();

      tooltip.target = null;
      focusout(target);
      expect(overlay.opened).to.be.true;
    });
  });

  describe('manual', () => {
    let target;

    beforeEach(() => {
      target = fixtureSync('<input>');
      tooltip.target = target;
      tooltip.manual = true;
    });

    it('should not open overlay on target keyboard focus', () => {
      tabKeyDown(target);
      target.focus();
      expect(overlay.opened).to.be.false;
    });

    it('should not open overlay on target mouseenter', () => {
      mouseenter(target);
      expect(overlay.opened).to.be.false;
    });

    it('should open overlay when opened is set to true', () => {
      tooltip.opened = true;
      expect(overlay.opened).to.be.true;
    });

    it('should not close overlay on target focusout', () => {
      tooltip.opened = true;
      target.focus();
      focusout(target);
      expect(overlay.opened).to.be.true;
    });

    it('should not close overlay on target mouseleave', () => {
      tooltip.opened = true;
      mouseenter(target);
      mouseleave(target);
      expect(overlay.opened).to.be.true;
    });

    it('should close overlay when opened is set to false', () => {
      tooltip.opened = true;

      tooltip.opened = false;
      expect(overlay.opened).to.be.false;
    });
  });
});
