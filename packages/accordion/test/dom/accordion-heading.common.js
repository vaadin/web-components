import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';

describe('vaadin-accordion-heading', () => {
  let heading;

  beforeEach(async () => {
    heading = fixtureSync('<vaadin-accordion-heading>Heading</vaadin-accordion-heading>');
    await nextRender();
  });

  describe('host', () => {
    it('default', async () => {
      await expect(heading).dom.to.equalSnapshot();
    });

    it('opened', async () => {
      heading.opened = true;
      await nextUpdate(heading);
      await expect(heading).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      heading.disabled = true;
      await expect(heading).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(heading).shadowDom.to.equalSnapshot();
    });

    it('disabled', async () => {
      heading.disabled = true;
      await expect(heading).shadowDom.to.equalSnapshot();
    });
  });
});
