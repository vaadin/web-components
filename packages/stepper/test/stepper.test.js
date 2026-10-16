import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import './enable-feature-flag.js';
import '../vaadin-stepper.js';

describe('vaadin-stepper', () => {
  let stepper, steps;

  function getIndicatorText(step) {
    return step.shadowRoot.querySelector('[part="indicator"]').textContent.trim();
  }

  function getConnector(step) {
    return step.shadowRoot.querySelector('[part="connector"]');
  }

  function getStateText(step) {
    return step.shadowRoot.querySelector('.sr-only')?.textContent;
  }

  beforeEach(async () => {
    stepper = fixtureSync(`
      <vaadin-stepper>
        <vaadin-step completed>Cart</vaadin-step>
        <vaadin-step current>Shipping</vaadin-step>
        <vaadin-step invalid>Payment</vaadin-step>
        <vaadin-step>Confirmation</vaadin-step>
      </vaadin-stepper>
    `);
    await nextRender();
    steps = [...stepper.querySelectorAll('vaadin-step')];
  });

  describe('custom element definition', () => {
    it('should be defined in custom element registry', () => {
      expect(customElements.get('vaadin-stepper')).to.be.ok;
      expect(customElements.get('vaadin-step')).to.be.ok;
    });
  });

  describe('role', () => {
    it('should set role attribute to list by default', () => {
      expect(stepper.getAttribute('role')).to.equal('list');
    });

    it('should not override custom role', async () => {
      stepper = fixtureSync('<vaadin-stepper role="navigation"></vaadin-stepper>');
      await nextRender();
      expect(stepper.getAttribute('role')).to.equal('navigation');
    });
  });

  describe('numbering', () => {
    it('should number steps without a state icon', () => {
      expect(steps.map(getIndicatorText)).to.eql(['', '2', '', '4']);
    });

    it('should renumber steps when a step is added', async () => {
      const step = document.createElement('vaadin-step');
      stepper.insertBefore(step, steps[0]);
      await nextFrame();
      expect(getIndicatorText(step)).to.equal('1');
      expect(getIndicatorText(steps[3])).to.equal('5');
    });

    it('should renumber steps when a step is removed', async () => {
      steps[1].remove();
      await nextFrame();
      expect(getIndicatorText(steps[3])).to.equal('3');
    });

    it('should skip hidden steps and renumber when hidden changes', async () => {
      steps[1].hidden = true;
      await nextFrame();
      expect(getIndicatorText(steps[3])).to.equal('3');

      steps[1].hidden = false;
      await nextFrame();
      expect(getIndicatorText(steps[3])).to.equal('4');
    });
  });

  describe('connector', () => {
    it('should render a connector for all but the last step', () => {
      expect(steps.map((step) => !!getConnector(step))).to.eql([true, true, true, false]);
    });

    it('should not render a connector for the last visible step', async () => {
      steps[3].hidden = true;
      await nextFrame();
      expect(getConnector(steps[2])).to.be.null;
    });
  });

  describe('orientation', () => {
    it('should reflect horizontal orientation by default', () => {
      expect(stepper.getAttribute('orientation')).to.equal('horizontal');
    });

    it('should forward orientation to steps', async () => {
      stepper.orientation = 'vertical';
      await nextFrame();
      steps.forEach((step) => expect(step.getAttribute('orientation')).to.equal('vertical'));
    });

    it('should set orientation on added steps', async () => {
      stepper.orientation = 'vertical';
      const step = document.createElement('vaadin-step');
      stepper.appendChild(step);
      await nextFrame();
      expect(step.getAttribute('orientation')).to.equal('vertical');
    });
  });

  describe('i18n', () => {
    it('should announce completed and invalid state by default', () => {
      expect(steps.map(getStateText)).to.eql(['Completed', undefined, 'Error', undefined]);
    });

    it('should use custom i18n in steps', async () => {
      stepper.i18n = { completed: 'Valmis' };
      await nextFrame();
      expect(getStateText(steps[0])).to.equal('Valmis');
      expect(getStateText(steps[2])).to.equal('Error');
    });
  });
});
