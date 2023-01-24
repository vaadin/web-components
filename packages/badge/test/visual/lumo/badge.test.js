import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/lumo/vaadin-badge.js';

describe('badge', () => {
  let div;

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
          fixtureSync(
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
      });
    });
  });
});
