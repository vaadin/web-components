import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextResize } from '@vaadin/testing-helpers';
import '../../src/vaadin-form-layout.js';

describe('vaadin-form-layout', () => {
  let layout;

  describe('auto-responsive', () => {
    describe('basic', () => {
      beforeEach(async () => {
        layout = fixtureSync(`
          <vaadin-form-layout auto-responsive>
            <input placeholder="First name" />
            <input placeholder="Last name" />
            <input placeholder="Email" />
            <input placeholder="Phone" />
          </vaadin-form-layout>
        `);
        await nextResize(layout);
      });

      describe('host', () => {
        it('default', async () => {
          await expect(layout).dom.to.equalSnapshot();
        });

        it('columnWidth', async () => {
          layout.columnWidth = '15em';
          await expect(layout).dom.to.equalSnapshot();
        });

        it('labelsAside', async () => {
          layout.labelsAside = true;
          await nextResize(layout);
          await expect(layout).dom.to.equalSnapshot();
        });

        it('expandColumns', async () => {
          layout.expandColumns = true;
          await expect(layout).dom.to.equalSnapshot();
        });

        it('expandFields', async () => {
          layout.expandFields = true;
          await expect(layout).dom.to.equalSnapshot();
        });
      });

      describe('shadow', () => {
        it('default', async () => {
          await expect(layout).shadowDom.to.equalSnapshot();
        });

        it('labelsAside in narrow container', async () => {
          layout.style.width = `calc(${layout.columnWidth} + 6em)`;
          layout.labelsAside = true;
          await nextResize(layout);
          await expect(layout).shadowDom.to.equalSnapshot();
        });

        it('labelsAside in wide container', async () => {
          layout.style.width = '40em';
          layout.labelsAside = true;
          await nextResize(layout);
          await expect(layout).shadowDom.to.equalSnapshot();
        });
      });
    });

    ['host', 'shadow'].forEach((name) => {
      describe(name, () => {
        const domType = name === 'host' ? 'dom' : 'shadowDom';

        describe('autoRows', () => {
          beforeEach(async () => {
            layout = fixtureSync(`
              <vaadin-form-layout auto-responsive auto-rows>
                <input placeholder="First name" />
                <input placeholder="Last name" />
                <br>
                <input hidden />
                <input placeholder="Address" colspan="2"/>
              </vaadin-form-layout>
            `);
            await nextResize(layout);
          });

          it('default', async () => {
            await expect(layout)[domType].to.equalSnapshot();
          });

          it('maxColumns < number of columns', async () => {
            layout.maxColumns = 1;
            await expect(layout)[domType].to.equalSnapshot();
          });

          it('maxColumns > number of columns', async () => {
            layout.maxColumns = 20;
            await expect(layout)[domType].to.equalSnapshot();
          });
        });

        describe('explicit rows', () => {
          beforeEach(async () => {
            layout = fixtureSync(`
              <vaadin-form-layout auto-responsive>
                <vaadin-form-row>
                  <input placeholder="First name" />
                  <input placeholder="Last name" />
                </vaadin-form-row>
                <vaadin-form-row>
                  <input hidden />
                  <input placeholder="Address" colspan="2"/>
                </vaadin-form-row>
              </vaadin-form-layout>
            `);
            await nextResize(layout);
          });

          it('default', async () => {
            await expect(layout)[domType].to.equalSnapshot();
          });

          it('maxColumns < number of columns', async () => {
            layout.maxColumns = 1;
            await expect(layout)[domType].to.equalSnapshot();
          });

          it('maxColumns > number of columns', async () => {
            layout.maxColumns = 20;
            await expect(layout)[domType].to.equalSnapshot();
          });
        });
      });
    });
  });

  describe('defaultAutoResponsiveFormLayout feature flag', () => {
    before(() => {
      window.Vaadin ??= {};
      window.Vaadin.featureFlags ??= {};
      window.Vaadin.featureFlags.defaultAutoResponsiveFormLayout = true;
    });

    after(() => {
      window.Vaadin.featureFlags.defaultAutoResponsiveFormLayout = false;
    });

    beforeEach(async () => {
      layout = fixtureSync(`
        <vaadin-form-layout>
          <input placeholder="First name" />
        </vaadin-form-layout>
      `);
      await nextResize(layout);
    });

    it('default', async () => {
      await expect(layout).dom.to.equalSnapshot();
    });
  });
});
