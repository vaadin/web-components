import { expect } from '@esm-bundle/chai';
import { enterKeyDown, escKeyDown, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/item/vaadin-item.js';
import '@vaadin/list-box/vaadin-list-box.js';
import './not-animated-styles.js';
import '../vaadin-select.js';
import { html, render } from 'lit';

describe('validation', () => {
  let select, valueButton;

  describe('basic', () => {
    beforeEach(async () => {
      select = fixtureSync('<vaadin-select></vaadin-select>');
      select.renderer = (root) => {
        render(
          html`
            <vaadin-list-box>
              <vaadin-item value="v1" label="o2">Option 2</vaadin-item>
              <vaadin-item value="v2" label="o2">Option 2</vaadin-item>
              <vaadin-item value="">Option 3</vaadin-item>
            </vaadin-list-box>
          `,
          root,
        );
      };
      valueButton = select._valueButton;
      await nextRender();
    });

    it('should pass the validation when the field is valid', () => {
      select.validate();
      expect(select.checkValidity()).to.be.true;
      expect(select.invalid).to.be.false;
    });

    it('should not pass the validation when the field is required and has no value', () => {
      select.required = true;

      enterKeyDown(valueButton);
      escKeyDown(valueButton);
      expect(select.checkValidity()).to.be.false;
      expect(select.invalid).to.be.true;
    });

    it('should validate when closing the overlay', () => {
      const spy = sinon.spy(select, 'validate');
      select.opened = true;

      select.opened = false;
      expect(spy.called).to.be.true;
    });

    it('should validate on programmatic blur', () => {
      const spy = sinon.spy(select, 'validate');
      select.blur();

      expect(spy.called).to.be.true;
    });

    it('should validate when setting value property', () => {
      const spy = sinon.spy(select, 'validate');
      select.value = 'v2';
      expect(spy.callCount).to.be.equal(1);

      select.value = '';
      expect(spy.callCount).to.be.equal(2);
    });

    it('should fire a validated event on validation success', () => {
      const validatedSpy = sinon.spy();
      select.addEventListener('validated', validatedSpy);
      select.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.true;
    });

    it('should fire a validated event on validation failure', () => {
      const validatedSpy = sinon.spy();
      select.addEventListener('validated', validatedSpy);
      select.required = true;
      select.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.false;
    });
  });

  describe('initial', () => {
    let validateSpy;

    beforeEach(() => {
      select = document.createElement('vaadin-select');
      validateSpy = sinon.spy(select, 'validate');
    });

    afterEach(() => {
      select.remove();
    });

    it('should not validate by default', async () => {
      document.body.appendChild(select);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the field has an initial value', async () => {
      select.value = 'value';
      document.body.appendChild(select);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });

    it('should not validate when the field has an initial value and invalid', async () => {
      select.value = 'value';
      select.invalid = true;
      document.body.appendChild(select);
      await nextRender();
      expect(validateSpy.called).to.be.false;
    });
  });
});
