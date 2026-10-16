import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '../enable-feature-flag.js';
import '../../src/vaadin-stepper.js';

describe('vaadin-stepper', () => {
  let stepper;

  beforeEach(async () => {
    stepper = fixtureSync(`
      <vaadin-stepper>
        <vaadin-step completed path="/cart">Cart</vaadin-step>
        <vaadin-step current>Shipping</vaadin-step>
      </vaadin-stepper>
    `);
    await nextRender();
  });

  it('host', async () => {
    await expect(stepper).dom.to.equalSnapshot();
  });

  it('shadow', async () => {
    await expect(stepper).shadowDom.to.equalSnapshot();
  });

  it('vertical', async () => {
    stepper.orientation = 'vertical';
    await nextFrame();
    await expect(stepper).dom.to.equalSnapshot();
  });
});
