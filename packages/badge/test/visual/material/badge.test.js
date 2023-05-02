import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/material/vaadin-badge.js';
((window.Vaadin ||= {}).featureFlags ||= {}).badgeComponent = true;

describe('badge', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.padding = '10px';
  });

  ['ltr', 'rtl'].forEach((dir) => {
    describe(dir, () => {
      before(() => {
        document.documentElement.setAttribute('dir', dir);
      });

      after(() => {
        document.documentElement.removeAttribute('dir');
      });

      describe(`${dir}`, () => {
        beforeEach(() => {
          element = fixtureSync(
            `
            <vaadin-badge>Hello</vaadin-badge>
            <vaadin-badge theme="error">Hello</vaadin-badge>
            <vaadin-badge theme="small">Hello</vaadin-badge>
            <vaadin-badge theme="success">Hello</vaadin-badge>
            <vaadin-badge theme="contrast">Hello</vaadin-badge>
            <vaadin-badge theme="primary">Hello</vaadin-badge>
            <vaadin-badge theme="pill">Hello</vaadin-badge>
            `,
            div,
          );
        });

        it('default', async () => {
          await visualDiff(div, `${dir}-default`);
        });

        it('bordered', async () => {
          element.setAttribute('theme', 'bordered');
          await visualDiff(div, `${dir}-bordered`);
        });
      });
    });
  });
});
