import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../src/vaadin-stepper.js';
import '../../../src/vaadin-step.js';

describe('stepper', () => {
  let div, element;

  afterEach(async () => {
    await resetMouse();
  });

  describe('vertical', () => {
    it('default', async () => {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.padding = '10px';
      div.style.width = '400px';
      element = fixtureSync(
        `<vaadin-stepper>
          <vaadin-step label="Step 1" description="First step description" href="/step1" state="completed"></vaadin-step>
          <vaadin-step label="Step 2" description="Second step description" href="/step2" state="active"></vaadin-step>
          <vaadin-step label="Step 3" description="Third step description" href="/step3"></vaadin-step>
          <vaadin-step label="Step 4" description="Fourth step description" href="/step4"></vaadin-step>
        </vaadin-stepper>`,
        div,
      );
      await visualDiff(div, 'vertical-default');
    });

    it('small', async () => {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.padding = '10px';
      div.style.width = '400px';
      element = fixtureSync(
        `<vaadin-stepper theme="small">
          <vaadin-step label="Step 1" description="First step" state="completed"></vaadin-step>
          <vaadin-step label="Step 2" description="Second step" state="active"></vaadin-step>
          <vaadin-step label="Step 3" description="Third step"></vaadin-step>
          <vaadin-step label="Step 4" description="Fourth step"></vaadin-step>
        </vaadin-stepper>`,
        div,
      );
      await visualDiff(div, 'vertical-small');
    });

    it('without-descriptions', async () => {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.padding = '10px';
      div.style.width = '400px';
      element = fixtureSync(
        `<vaadin-stepper>
          <vaadin-step label="Step 1" state="completed"></vaadin-step>
          <vaadin-step label="Step 2" state="completed"></vaadin-step>
          <vaadin-step label="Step 3" state="active"></vaadin-step>
          <vaadin-step label="Step 4"></vaadin-step>
        </vaadin-stepper>`,
        div,
      );
      await visualDiff(div, 'vertical-no-descriptions');
    });
  });

  describe('horizontal', () => {
    it('default', async () => {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.padding = '10px';
      div.style.width = '800px';
      element = fixtureSync(
        `<vaadin-stepper orientation="horizontal">
          <vaadin-step label="Step 1" href="/step1" state="completed"></vaadin-step>
          <vaadin-step label="Step 2" href="/step2" state="completed"></vaadin-step>
          <vaadin-step label="Step 3" href="/step3" state="active"></vaadin-step>
          <vaadin-step label="Step 4" href="/step4"></vaadin-step>
        </vaadin-stepper>`,
        div,
      );
      await visualDiff(div, 'horizontal-default');
    });

    it('small', async () => {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.padding = '10px';
      div.style.width = '800px';
      element = fixtureSync(
        `<vaadin-stepper orientation="horizontal" theme="small">
          <vaadin-step label="Upload" state="completed"></vaadin-step>
          <vaadin-step label="Process" state="completed"></vaadin-step>
          <vaadin-step label="Review" state="active"></vaadin-step>
          <vaadin-step label="Complete"></vaadin-step>
        </vaadin-stepper>`,
        div,
      );
      await visualDiff(div, 'horizontal-small');
    });

    it('with-descriptions', async () => {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.padding = '10px';
      div.style.width = '1000px';
      element = fixtureSync(
        `<vaadin-stepper orientation="horizontal">
          <vaadin-step label="Cart" description="Review items" state="completed"></vaadin-step>
          <vaadin-step label="Shipping" description="Enter address" state="active"></vaadin-step>
          <vaadin-step label="Payment" description="Payment method"></vaadin-step>
          <vaadin-step label="Confirm" description="Review order"></vaadin-step>
        </vaadin-stepper>`,
        div,
      );
      await visualDiff(div, 'horizontal-with-descriptions');
    });
  });

  describe('states', () => {
    it('all-states', async () => {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.padding = '10px';
      div.style.width = '400px';
      element = fixtureSync(
        `<vaadin-stepper>
          <vaadin-step label="Completed step" description="This step is done" state="completed"></vaadin-step>
          <vaadin-step label="Active step" description="Currently working on this" state="active"></vaadin-step>
          <vaadin-step label="Error step" description="Something went wrong" state="error"></vaadin-step>
          <vaadin-step label="Inactive step" description="Not started yet"></vaadin-step>
        </vaadin-stepper>`,
        div,
      );
      await visualDiff(div, 'all-states');
    });

    it('hover', async () => {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.padding = '10px';
      div.style.width = '400px';
      element = fixtureSync(
        `<vaadin-stepper>
          <vaadin-step label="Step 1" href="/step1" state="completed"></vaadin-step>
          <vaadin-step label="Step 2" href="/step2" state="active"></vaadin-step>
          <vaadin-step label="Step 3" href="/step3"></vaadin-step>
        </vaadin-stepper>`,
        div,
      );
      const step = element.querySelector('vaadin-step[href="/step3"]');
      await sendMouseToElement({ type: 'move', element: step });
      await visualDiff(div, 'hover');
    });

    it('focus-ring', async () => {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.padding = '10px';
      div.style.width = '400px';
      element = fixtureSync(
        `<vaadin-stepper>
          <vaadin-step label="Step 1" href="/step1" state="completed"></vaadin-step>
          <vaadin-step label="Step 2" href="/step2" state="active"></vaadin-step>
          <vaadin-step label="Step 3" href="/step3"></vaadin-step>
        </vaadin-stepper>`,
        div,
      );
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'focus-ring');
    });

    it('disabled', async () => {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.padding = '10px';
      div.style.width = '400px';
      element = fixtureSync(
        `<vaadin-stepper>
          <vaadin-step label="Step 1" state="completed"></vaadin-step>
          <vaadin-step label="Step 2 (Disabled)" href="/step2" disabled state="active"></vaadin-step>
          <vaadin-step label="Step 3"></vaadin-step>
        </vaadin-stepper>`,
        div,
      );
      await visualDiff(div, 'disabled');
    });
  });

  describe('without-links', () => {
    it('no-href', async () => {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.padding = '10px';
      div.style.width = '400px';
      element = fixtureSync(
        `<vaadin-stepper>
          <vaadin-step label="Initialize" description="System initialization" state="completed"></vaadin-step>
          <vaadin-step label="Configure" description="Apply configuration" state="completed"></vaadin-step>
          <vaadin-step label="Deploy" description="Deploy to production" state="active"></vaadin-step>
          <vaadin-step label="Monitor" description="Monitor system"></vaadin-step>
        </vaadin-stepper>`,
        div,
      );
      await visualDiff(div, 'no-href');
    });
  });

  describe('RTL', () => {
    it('rtl-vertical', async () => {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.padding = '10px';
      div.style.width = '400px';
      div.setAttribute('dir', 'rtl');
      element = fixtureSync(
        `<vaadin-stepper>
          <vaadin-step label="الخطوة 1" description="الوصف الأول" state="completed"></vaadin-step>
          <vaadin-step label="الخطوة 2" description="الوصف الثاني" state="active"></vaadin-step>
          <vaadin-step label="الخطوة 3" description="الوصف الثالث"></vaadin-step>
        </vaadin-stepper>`,
        div,
      );
      await visualDiff(div, 'rtl-vertical');
    });

    it('rtl-horizontal', async () => {
      div = document.createElement('div');
      div.style.display = 'inline-block';
      div.style.padding = '10px';
      div.style.width = '800px';
      div.setAttribute('dir', 'rtl');
      element = fixtureSync(
        `<vaadin-stepper orientation="horizontal">
          <vaadin-step label="الخطوة 1" state="completed"></vaadin-step>
          <vaadin-step label="الخطوة 2" state="active"></vaadin-step>
          <vaadin-step label="الخطوة 3"></vaadin-step>
          <vaadin-step label="الخطوة 4"></vaadin-step>
        </vaadin-stepper>`,
        div,
      );
      await visualDiff(div, 'rtl-horizontal');
    });
  });
});
