import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-accordion-heading.js';

describe('vaadin-accordion-heading', () => {
  let heading;

  beforeEach(() => {
    heading = fixtureSync('<vaadin-accordion-heading>Heading</vaadin-accordion-heading>');
  });

  describe('host', () => {
    it('default', async () => {
      await expect(heading).dom.to.equalSnapshot();
    });

    it('opened', async () => {
      heading.opened = true;
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
