import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/material/vaadin-horizontal-layout.js';

describe('horizontal-layout', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'flex';
    element = fixtureSync(
      `
        <vaadin-horizontal-layout style="border: solid 2px blue">
          <div style="background: #e2e2e2; padding: 20px;">Item 1</div>
          <div style="background: #f3f3f3; padding: 20px;">Item 2</div>
        </vaadin-horizontal-layout>
      `,
      div,
    );
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('theme-margin', async () => {
    element.setAttribute('theme', 'margin');
    await visualDiff(div, 'theme-margin');
  });

  it('theme-padding', async () => {
    element.setAttribute('theme', 'padding');
    await visualDiff(div, 'theme-padding');
  });

  it('theme-spacing', async () => {
    element.setAttribute('theme', 'spacing');
    await visualDiff(div, 'theme-spacing');
  });

  it('theme-margin-padding', async () => {
    element.setAttribute('theme', 'margin padding');
    await visualDiff(div, 'theme-margin-padding');
  });

  it('theme-margin-spacing', async () => {
    element.setAttribute('theme', 'margin spacing');
    await visualDiff(div, 'theme-margin-spacing');
  });

  it('theme-margin-padding-spacing', async () => {
    element.setAttribute('theme', 'margin padding spacing');
    await visualDiff(div, 'theme-margin-padding-spacing');
  });

  it('theme-wrap', async () => {
    element.setAttribute('theme', 'wrap');
    element.style.width = '100px';
    await visualDiff(div, 'theme-wrap');
  });

  describe('slots', () => {
    describe('all', () => {
      beforeEach(() => {
        element = fixtureSync(
          `
            <vaadin-horizontal-layout style="border: solid 1px blue; width: 600px;" theme="spacing wrap">
              <div style="background: #90ee90; width: 100px">Start</div>
              <div style="background: #90ee90; width: 100px">Start</div>
              <div slot="middle" style="background: #ffd700;">Middle</div>
              <div slot="end" style="background: #f08080; width: 100px">End</div>
            </vaadin-horizontal-layout>
          `,
        );
      });

      it('default', async () => {
        await visualDiff(element, 'slots-all');
      });

      it('wrap end', async () => {
        element.style.width = '350px';
        await visualDiff(element, 'slots-all-wrap-end');
      });

      it('wrap middle', async () => {
        element.style.width = '350px';
        element.firstElementChild.style.width = '200px';
        await visualDiff(element, 'slots-all-wrap-middle');
      });
    });

    describe('without end', () => {
      beforeEach(() => {
        element = fixtureSync(
          `
            <vaadin-horizontal-layout style="border: solid 1px blue; width: 400px;" theme="spacing wrap">
              <div style="background: #90ee90; width: 100px">Start</div>
              <div style="background: #90ee90; width: 100px">Start</div>
              <div slot="middle" style="background: #ffd700;">Middle</div>
            </vaadin-horizontal-layout>
          `,
        );
      });

      it('default', async () => {
        await visualDiff(element, 'slots-without-end');
      });

      it('wrap', async () => {
        element.style.width = '250px';
        await visualDiff(element, 'slots-without-end-wrap');
      });
    });

    describe('without start', () => {
      beforeEach(() => {
        element = fixtureSync(
          `
            <vaadin-horizontal-layout style="border: solid 1px blue; width: 400px;" theme="spacing wrap">
              <div slot="middle" style="background: #ffd700;">Middle</div>
              <div slot="end" style="background: #f08080; width: 100px">End</div>
              <div slot="end" style="background: #f08080; width: 100px">End</div>
            </vaadin-horizontal-layout>
          `,
        );
      });

      it('default', async () => {
        await visualDiff(element, 'slots-without-start');
      });

      it('wrap', async () => {
        element.style.width = '250px';
        await visualDiff(element, 'slots-without-start-wrap');
      });
    });
  });
});
