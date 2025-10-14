import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-stepper.js';
import '../src/vaadin-step.js';

describe('vaadin-stepper', () => {
  let stepper;

  describe('basic', () => {
    beforeEach(() => {
      stepper = fixtureSync(`
        <vaadin-stepper>
          <vaadin-step label="Step 1" href="/step1"></vaadin-step>
          <vaadin-step label="Step 2" href="/step2"></vaadin-step>
          <vaadin-step label="Step 3"></vaadin-step>
        </vaadin-stepper>
      `);
    });

    it('should have correct tag name', () => {
      expect(stepper.localName).to.equal('vaadin-stepper');
    });

    it('should have navigation role', () => {
      expect(stepper.getAttribute('role')).to.equal('navigation');
    });

    it('should have aria-label', () => {
      expect(stepper.getAttribute('aria-label')).to.equal('Progress');
    });

    it('should have vertical orientation by default', () => {
      expect(stepper.orientation).to.equal('vertical');
      expect(stepper.getAttribute('orientation')).to.equal('vertical');
    });

    it('should update steps array on slot change', async () => {
      await nextFrame();
      expect(stepper._steps).to.have.lengthOf(3);
      expect(stepper._steps[0].label).to.equal('Step 1');
      expect(stepper._steps[1].label).to.equal('Step 2');
      expect(stepper._steps[2].label).to.equal('Step 3');
    });

    it('should mark last step', async () => {
      await nextFrame();
      expect(stepper._steps[0].hasAttribute('last')).to.be.false;
      expect(stepper._steps[1].hasAttribute('last')).to.be.false;
      expect(stepper._steps[2].hasAttribute('last')).to.be.true;
    });

    it('should set step numbers', async () => {
      await nextFrame();
      expect(stepper._steps[0]._stepNumber).to.equal(1);
      expect(stepper._steps[1]._stepNumber).to.equal(2);
      expect(stepper._steps[2]._stepNumber).to.equal(3);
    });
  });

  describe('orientation', () => {
    beforeEach(() => {
      stepper = fixtureSync(`
        <vaadin-stepper orientation="horizontal">
          <vaadin-step label="Step 1"></vaadin-step>
          <vaadin-step label="Step 2"></vaadin-step>
        </vaadin-stepper>
      `);
    });

    it('should set horizontal orientation', () => {
      expect(stepper.orientation).to.equal('horizontal');
      expect(stepper.getAttribute('orientation')).to.equal('horizontal');
    });

    it('should update step orientation', async () => {
      await nextFrame();
      expect(stepper._steps[0].getAttribute('orientation')).to.equal('horizontal');
      expect(stepper._steps[1].getAttribute('orientation')).to.equal('horizontal');
    });

    it('should update orientation when changed', async () => {
      await nextFrame();
      stepper.orientation = 'vertical';
      await nextFrame();
      expect(stepper._steps[0].getAttribute('orientation')).to.equal('vertical');
      expect(stepper._steps[1].getAttribute('orientation')).to.equal('vertical');
    });
  });

  describe('theme', () => {
    beforeEach(() => {
      stepper = fixtureSync(`
        <vaadin-stepper theme="small">
          <vaadin-step label="Step 1"></vaadin-step>
          <vaadin-step label="Step 2"></vaadin-step>
        </vaadin-stepper>
      `);
    });

    it('should apply small theme to steps', async () => {
      await nextFrame();
      expect(stepper._steps[0].hasAttribute('small')).to.be.true;
      expect(stepper._steps[1].hasAttribute('small')).to.be.true;
    });
  });

  describe('step states', () => {
    beforeEach(() => {
      stepper = fixtureSync(`
        <vaadin-stepper>
          <vaadin-step label="Step 1"></vaadin-step>
          <vaadin-step label="Step 2"></vaadin-step>
          <vaadin-step label="Step 3"></vaadin-step>
        </vaadin-stepper>
      `);
    });

    it('should set step state', async () => {
      await nextFrame();
      stepper.setStepState('active', 0);
      await nextRender();
      expect(stepper._steps[0].state).to.equal('active');
      expect(stepper._steps[0].hasAttribute('active')).to.be.true;
    });

    it('should complete steps until index', async () => {
      await nextFrame();
      stepper.completeStepsUntil(2);
      expect(stepper._steps[0].state).to.equal('completed');
      expect(stepper._steps[1].state).to.equal('completed');
      expect(stepper._steps[2].state).to.equal('inactive');
    });

    it('should get active step', async () => {
      await nextFrame();
      stepper.setStepState('active', 1);
      await nextRender();
      const activeStep = stepper.getActiveStep();
      expect(activeStep).to.equal(stepper._steps[1]);
    });

    it('should return null when no active step', async () => {
      await nextFrame();
      const activeStep = stepper.getActiveStep();
      expect(activeStep).to.be.null;
    });

    it('should reset all steps', async () => {
      await nextFrame();
      stepper.setStepState('active', 0);
      stepper.setStepState('completed', 1);
      stepper.setStepState('error', 2);

      stepper.reset();

      expect(stepper._steps[0].state).to.equal('inactive');
      expect(stepper._steps[1].state).to.equal('inactive');
      expect(stepper._steps[2].state).to.equal('inactive');
    });
  });
});

describe('vaadin-step', () => {
  let step;

  describe('basic', () => {
    beforeEach(() => {
      step = fixtureSync(`<vaadin-step label="Test Step" description="Test description"></vaadin-step>`);
    });

    it('should have correct tag name', () => {
      expect(step.localName).to.equal('vaadin-step');
    });

    it('should have listitem role', () => {
      expect(step.getAttribute('role')).to.equal('listitem');
    });

    it('should render label', () => {
      expect(step.label).to.equal('Test Step');
    });

    it('should render description', () => {
      expect(step.description).to.equal('Test description');
    });

    it('should have inactive state by default', () => {
      expect(step.state).to.equal('inactive');
    });
  });

  describe('with href', () => {
    beforeEach(() => {
      step = fixtureSync(`<vaadin-step label="Step" href="/test"></vaadin-step>`);
    });

    it('should have href', () => {
      expect(step.href).to.equal('/test');
    });

    it('should render link element', () => {
      const link = step.shadowRoot.querySelector('a');
      expect(link).to.exist;
      expect(link.getAttribute('href')).to.equal('/test');
    });

    it('should support target attribute', async () => {
      step.target = '_blank';
      await nextFrame();
      const link = step.shadowRoot.querySelector('a');
      expect(link.getAttribute('target')).to.equal('_blank');
    });

    it('should support router-ignore', async () => {
      step.routerIgnore = true;
      await nextFrame();
      const link = step.shadowRoot.querySelector('a');
      expect(link.hasAttribute('router-ignore')).to.be.true;
    });
  });

  describe('without href', () => {
    beforeEach(() => {
      step = fixtureSync(`<vaadin-step label="Step"></vaadin-step>`);
    });

    it('should render div element', () => {
      const div = step.shadowRoot.querySelector('div');
      expect(div).to.exist;
      const link = step.shadowRoot.querySelector('a');
      expect(link).to.not.exist;
    });
  });

  describe('states', () => {
    beforeEach(() => {
      step = fixtureSync(`<vaadin-step label="Step"></vaadin-step>`);
    });

    it('should set active state', async () => {
      step.state = 'active';
      await nextRender();
      expect(step.hasAttribute('active')).to.be.true;
      expect(step.hasAttribute('completed')).to.be.false;
      expect(step.hasAttribute('error')).to.be.false;
    });

    it('should set completed state', async () => {
      step.state = 'completed';
      await nextRender();
      expect(step.hasAttribute('completed')).to.be.true;
      expect(step.hasAttribute('active')).to.be.false;
      expect(step.hasAttribute('error')).to.be.false;
    });

    it('should set error state', async () => {
      step.state = 'error';
      await nextRender();
      expect(step.hasAttribute('error')).to.be.true;
      expect(step.hasAttribute('active')).to.be.false;
      expect(step.hasAttribute('completed')).to.be.false;
    });

    it('should show checkmark for completed state', async () => {
      step.state = 'completed';
      await nextFrame();
      const indicator = step.shadowRoot.querySelector('[part="indicator"]');
      expect(indicator.querySelector('.checkmark')).to.exist;
    });

    it('should show error icon for error state', async () => {
      step.state = 'error';
      await nextFrame();
      const indicator = step.shadowRoot.querySelector('[part="indicator"]');
      expect(indicator.querySelector('.error-icon')).to.exist;
    });

    it('should show step number for other states', async () => {
      step._setStepNumber(3);
      await nextFrame();
      const indicator = step.shadowRoot.querySelector('[part="indicator"]');
      expect(indicator.querySelector('.step-number').textContent).to.equal('3');
    });
  });

  describe('disabled', () => {
    beforeEach(() => {
      step = fixtureSync(`<vaadin-step label="Step" href="/test" disabled></vaadin-step>`);
    });

    it('should be disabled', () => {
      expect(step.disabled).to.be.true;
    });

    it('should have disabled attribute', () => {
      expect(step.hasAttribute('disabled')).to.be.true;
    });

    it('should render as div when disabled', () => {
      const div = step.shadowRoot.querySelector('div');
      expect(div).to.exist;
      const link = step.shadowRoot.querySelector('a');
      expect(link).to.not.exist;
    });
  });

  describe('current page detection', () => {
    let originalLocation;

    beforeEach(() => {
      originalLocation = window.location.href;
      window.history.pushState({}, '', '/test-page');
      step = fixtureSync(`<vaadin-step label="Step" href="/test-page"></vaadin-step>`);
    });

    afterEach(() => {
      window.history.pushState({}, '', originalLocation);
    });

    it('should detect current page', () => {
      expect(step.current).to.be.true;
      expect(step.active).to.be.true;
    });

    it('should set aria-current for current page', async () => {
      await nextRender();
      const link = step.shadowRoot.querySelector('a');
      expect(link.getAttribute('aria-current')).to.equal('step');
    });

    it('should update on navigation', async () => {
      window.history.pushState({}, '', '/other-page');
      window.dispatchEvent(new PopStateEvent('popstate'));
      await nextFrame();
      expect(step.current).to.be.false;
    });
  });

  describe('orientation', () => {
    beforeEach(() => {
      step = fixtureSync(
        `<vaadin-step label="Step with long label" description="Long description text"></vaadin-step>`,
      );
    });

    it('should have vertical orientation by default', () => {
      expect(step.getAttribute('orientation')).to.equal('vertical');
    });

    it('should update orientation', async () => {
      step._setOrientation('horizontal');
      await nextRender();
      expect(step.getAttribute('orientation')).to.equal('horizontal');
    });
  });

  describe('size', () => {
    beforeEach(() => {
      step = fixtureSync(`<vaadin-step label="Step"></vaadin-step>`);
    });

    it('should not be small by default', () => {
      expect(step.hasAttribute('small')).to.be.false;
    });

    it('should set small size', async () => {
      step._setSmall(true);
      await nextRender();

      expect(step.hasAttribute('small')).to.be.true;
    });
  });

  describe('connector', () => {
    beforeEach(() => {
      step = fixtureSync(`<vaadin-step label="Step"></vaadin-step>`);
    });

    it('should show connector by default', () => {
      const connector = step.shadowRoot.querySelector('[part="connector"]');
      expect(connector).to.exist;
    });

    it('should hide connector for last step', async () => {
      step._setLast(true);
      await nextFrame();
      const connector = step.shadowRoot.querySelector('[part="connector"]');
      expect(connector).to.not.exist;
    });
  });
});
