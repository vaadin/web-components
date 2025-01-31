import { expect } from '@vaadin/chai-plugins';
import { setViewport } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '@vaadin/text-field';
import '@vaadin/form-layout';
import '@vaadin/form-layout/vaadin-form-item.js';
import '@vaadin/dialog';

describe('form-layout in dialog', () => {
  let dialog, formItems;

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
    formItems = [...dialog.$.overlay.querySelectorAll('vaadin-form-item')];
  });

  afterEach(async () => {
    dialog.opened = false;
    await nextFrame();
  });

  it('should arrange form items in two columns', () => {
    const columns = new Set(formItems.map((child) => child.offsetLeft));
    expect(columns.size).to.equal(2);
  });
});
