import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-button.js';

describe('vaadin-button', () => {
  let button;

  beforeEach(() => {
    button = fixtureSync('<vaadin-button>Confirm</vaadin-button>');
  });

  it('default', async () => {
    await expect(button).shadowDom.to.equalSnapshot();
  });
});
