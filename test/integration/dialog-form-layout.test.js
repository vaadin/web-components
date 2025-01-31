import { expect } from '@vaadin/chai-plugins';
import { setViewport } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '@vaadin/text-field';
import '@vaadin/form-layout';
import '@vaadin/form-layout/vaadin-form-item.js';
import '@vaadin/dialog';

describe('form-layout in dialog', () => {
  let dialog, formLayout;

  before(async () => {
    await setViewport({ width: 1024, height: 768 });
  });

  beforeEach(async () => {
    dialog = fixtureSync(`<vaadin-dialog></vaadin-dialog>`);
    dialog.renderer = (root) => {
      root.innerHTML = `
      <vaadin-form-layout>
        <vaadin-form-item>
          <label slot="label">First name</label>
          <vaadin-text-field></vaadin-text-field>
        </vaadin-form-item>
        <vaadin-form-item>
          <label slot="label">Last name</label>
          <vaadin-text-field></vaadin-text-field>
        </vaadin-form-item>
        <vaadin-form-item>
          <label slot="label">Email</label>
          <vaadin-text-field></vaadin-text-field>
        </vaadin-form-item>
        <vaadin-form-item>
          <label slot="label">Phone</label>
          <vaadin-text-field></vaadin-text-field>
        </vaadin-form-item>
      </vaadin-form-layout>
    `;
    };
    dialog.opened = true;
    await nextRender();
    formLayout = dialog.$.overlay.querySelector('vaadin-form-layout');
  });

  afterEach(async () => {
    dialog.opened = false;
    await nextFrame();
  });

  it('should arrange form items in two columns', () => {
    const formItems = [...formLayout.querySelectorAll('vaadin-form-item')];

    // Assert that 1st and 2nd form items are on the same row
    expect(formItems[0].offsetTop).to.equal(formItems[1].offsetTop);

    // Assert that 3rd and 4th form items are on the same row
    expect(formItems[2].offsetTop).to.equal(formItems[3].offsetTop);

    // Assert that 3rd form item is on a row below 1st form item
    expect(formItems[2].offsetTop).to.be.greaterThan(formItems[0].offsetTop);
  });
});
