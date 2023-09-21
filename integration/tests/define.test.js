import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import '@vaadin/button';
import { Button } from '@vaadin/button';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';

describe('define', () => {
  describe('same version', () => {
    beforeEach(() => {
      sinon.stub(console, 'warn');
    });

    afterEach(() => {
      console.warn.restore();
    });

    it('should warn when component with same version is loaded twice', () => {
      defineCustomElement({ is: 'vaadin-button', version: Button.version });
      expect(console.warn.calledOnce).to.be.true;
      expect(console.warn.firstCall.args[0]).to.equal('The component vaadin-button has been loaded twice');
    });
  });

  describe('different version', () => {
    beforeEach(() => {
      sinon.stub(console, 'error');
    });

    afterEach(() => {
      console.error.restore();
    });

    it('should log an error when two components with different versions are loaded', () => {
      defineCustomElement({ is: 'vaadin-button', version: '0.0.1' });
      expect(console.error.calledOnce).to.be.true;
      expect(console.error.firstCall.args[0]).to.equal(
        `Tried to define vaadin-button version 0.0.1 when version ${Button.version} is already in use. Something will probably break.`,
      );
    });
  });
});
