import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-stepper.js';
import '../../src/vaadin-step.js';

describe('vaadin-stepper', () => {
  let stepper;

  describe('stepper host', () => {
    beforeEach(() => {
      stepper = fixtureSync(`
        <vaadin-stepper>
          <vaadin-step label="Step 1" href="/step1" state="completed"></vaadin-step>
          <vaadin-step label="Step 2" href="/step2" state="active"></vaadin-step>
          <vaadin-step label="Step 3" description="Third step"></vaadin-step>
        </vaadin-stepper>
      `);
    });

    it('default', async () => {
      await expect(stepper).dom.to.equalSnapshot();
    });

    it('horizontal', async () => {
      stepper.orientation = 'horizontal';
      await expect(stepper).dom.to.equalSnapshot();
    });

    it('small theme', async () => {
      stepper.setAttribute('theme', 'small');
      await expect(stepper).dom.to.equalSnapshot();
    });
  });

  describe('stepper shadow', () => {
    beforeEach(() => {
      stepper = fixtureSync(`
        <vaadin-stepper>
          <vaadin-step label="Step 1" state="completed"></vaadin-step>
          <vaadin-step label="Step 2" state="active"></vaadin-step>
          <vaadin-step label="Step 3"></vaadin-step>
        </vaadin-stepper>
      `);
    });

    it('default', async () => {
      await expect(stepper).shadowDom.to.equalSnapshot();
    });
  });
});

describe('vaadin-step', () => {
  let step;

  describe('step host', () => {
    it('default with href', async () => {
      step = fixtureSync('<vaadin-step label="Test Step" href="/test"></vaadin-step>');
      await expect(step).dom.to.equalSnapshot();
    });

    it('default without href', async () => {
      step = fixtureSync('<vaadin-step label="Test Step"></vaadin-step>');
      await expect(step).dom.to.equalSnapshot();
    });

    it('with description', async () => {
      step = fixtureSync('<vaadin-step label="Test Step" description="Step description"></vaadin-step>');
      await expect(step).dom.to.equalSnapshot();
    });

    it('active state', async () => {
      step = fixtureSync('<vaadin-step label="Active Step" state="active"></vaadin-step>');
      await expect(step).dom.to.equalSnapshot();
    });

    it('completed state', async () => {
      step = fixtureSync('<vaadin-step label="Completed Step" state="completed"></vaadin-step>');
      await expect(step).dom.to.equalSnapshot();
    });

    it('error state', async () => {
      step = fixtureSync('<vaadin-step label="Error Step" state="error"></vaadin-step>');
      await expect(step).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      step = fixtureSync('<vaadin-step label="Disabled Step" href="/test" disabled></vaadin-step>');
      await expect(step).dom.to.equalSnapshot();
    });

    it('with target', async () => {
      step = fixtureSync('<vaadin-step label="External" href="https://example.com" target="_blank"></vaadin-step>');
      await expect(step).dom.to.equalSnapshot();
    });

    it('router-ignore', async () => {
      step = fixtureSync('<vaadin-step label="No Router" href="/api" router-ignore></vaadin-step>');
      await expect(step).dom.to.equalSnapshot();
    });

    it('focused', async () => {
      step = fixtureSync('<vaadin-step label="Test Step" href="/test"></vaadin-step>');
      step.focus();
      await expect(step).dom.to.equalSnapshot();
    });

    it('focus-ring', async () => {
      step = fixtureSync('<vaadin-step label="Test Step" href="/test"></vaadin-step>');
      await sendKeys({ press: 'Tab' });
      await expect(step).dom.to.equalSnapshot();
    });

    it('last step', async () => {
      step = fixtureSync('<vaadin-step label="Last Step"></vaadin-step>');
      step._setLast(true);
      await expect(step).dom.to.equalSnapshot();
    });

    it('horizontal orientation', async () => {
      step = fixtureSync(
        '<vaadin-step label="Horizontal Step" description="With long description text"></vaadin-step>',
      );
      step._setOrientation('horizontal');
      await expect(step).dom.to.equalSnapshot();
    });

    it('small size', async () => {
      step = fixtureSync('<vaadin-step label="Small Step" description="Small description"></vaadin-step>');
      step._setSmall(true);
      await expect(step).dom.to.equalSnapshot();
    });

    it('with step number', async () => {
      step = fixtureSync('<vaadin-step label="Step"></vaadin-step>');
      step._setStepNumber(3);
      await expect(step).dom.to.equalSnapshot();
    });

    it('current', async () => {
      step = fixtureSync('<vaadin-step label="Current" href="/"></vaadin-step>');
      step._setCurrent(true);
      await expect(step).dom.to.equalSnapshot();
    });
  });

  describe('step shadow', () => {
    it('default with href', async () => {
      step = fixtureSync('<vaadin-step label="Test Step" href="/test"></vaadin-step>');
      step._setStepNumber(1);
      await expect(step).shadowDom.to.equalSnapshot();
    });

    it('default without href', async () => {
      step = fixtureSync('<vaadin-step label="Test Step"></vaadin-step>');
      step._setStepNumber(1);
      await expect(step).shadowDom.to.equalSnapshot();
    });

    it('with description', async () => {
      step = fixtureSync('<vaadin-step label="Test Step" description="Step description"></vaadin-step>');
      step._setStepNumber(1);
      await expect(step).shadowDom.to.equalSnapshot();
    });

    it('completed state', async () => {
      step = fixtureSync('<vaadin-step label="Completed Step" state="completed"></vaadin-step>');
      await expect(step).shadowDom.to.equalSnapshot();
    });

    it('error state', async () => {
      step = fixtureSync('<vaadin-step label="Error Step" state="error"></vaadin-step>');
      await expect(step).shadowDom.to.equalSnapshot();
    });

    it('disabled', async () => {
      step = fixtureSync('<vaadin-step label="Disabled Step" href="/test" disabled></vaadin-step>');
      step._setStepNumber(1);
      await expect(step).shadowDom.to.equalSnapshot();
    });

    it('last step', async () => {
      step = fixtureSync('<vaadin-step label="Last Step"></vaadin-step>');
      step._setLast(true);
      step._setStepNumber(4);
      await expect(step).shadowDom.to.equalSnapshot();
    });
  });
});
