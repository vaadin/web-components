import { expect } from '@esm-bundle/chai';
import { enterKeyDown, escKeyDown, fixtureSync, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/item/vaadin-item.js';
import '@vaadin/list-box/vaadin-list-box.js';
import { html, render } from 'lit';

describe('validation', () => {
  let select, valueButton;

  describe('basic', () => {
    beforeEach(async () => {
      select = fixtureSync('<vaadin-select></vaadin-select>');
      await nextRender();
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
      valueButton = select.querySelector('vaadin-select-value-button');
    });

    it('should pass the validation when the field is valid', () => {
      select.validate();
      expect(select.checkValidity()).to.be.true;
      expect(select.invalid).to.be.false;
    });

    it('should not pass the validation when the field is required and has no value', async () => {
      select.required = true;
      await nextUpdate(select);

      enterKeyDown(valueButton);
      await oneEvent(select._overlayElement, 'vaadin-overlay-open');

      escKeyDown(select._items[2]);
      await nextUpdate(select);

      expect(select.checkValidity()).to.be.false;
      expect(select.invalid).to.be.true;
    });

    it('should pass the validation when the field is required and readonly', async () => {
      select.required = true;
      select.readonly = true;
      await nextUpdate(select);

      select.validate();

      expect(select.checkValidity()).to.be.true;
    });

    it('should validate when required property is removed', async () => {
      select.required = true;
      await nextUpdate(select);

      const spy = sinon.spy(select, 'validate');
      select.required = false;
      await nextUpdate(select);
      expect(spy.calledOnce).to.be.true;
    });

    it('should update invalid state when required property is removed', async () => {
      select.required = true;
      await nextUpdate(select);

      select.validate();
      expect(select.invalid).to.be.true;

      select.required = false;
      await nextUpdate(select);
      expect(select.invalid).to.be.false;
    });

    it('should validate when closing the overlay', async () => {
      const spy = sinon.spy(select, 'validate');
      select.opened = true;
      await nextUpdate(select);

      select.opened = false;
      await nextUpdate(select);
      expect(spy.called).to.be.true;
    });

    it('should validate on programmatic blur', () => {
      const spy = sinon.spy(select, 'validate');
      select.blur();

      expect(spy.called).to.be.true;
    });

    it('should validate when setting value property', async () => {
      const spy = sinon.spy(select, 'validate');
      select.value = 'v2';
      await nextUpdate(select);
      expect(spy.callCount).to.be.equal(1);

      select.value = '';
      await nextUpdate(select);
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

    it('should fire a validated event on validation failure', async () => {
      const validatedSpy = sinon.spy();
      select.addEventListener('validated', validatedSpy);
      select.required = true;
      await nextUpdate(select);
      select.validate();

      expect(validatedSpy.calledOnce).to.be.true;
      const event = validatedSpy.firstCall.args[0];
      expect(event.detail.valid).to.be.false;
    });

    describe('document losing focus', () => {
      beforeEach(() => {
        sinon.stub(document, 'hasFocus').returns(false);
      });

      afterEach(() => {
        document.hasFocus.restore();
      });

      it('should not validate on blur when document does not have focus', () => {
        const spy = sinon.spy(select, 'validate');
        select.blur();

        expect(spy.called).to.be.false;
      });
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
