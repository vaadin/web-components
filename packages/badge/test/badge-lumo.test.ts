import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/badge.css';
import '../src/vaadin-badge.js';
import type { Badge } from '../src/vaadin-badge.js';

describe('vaadin-badge (Lumo)', () => {
  let badge: Badge;

  beforeEach(async () => {
    badge = fixtureSync('<vaadin-badge>Badge</vaadin-badge>');
    await nextRender();
  });

  it('should not use a negative margin when the border is removed', () => {
    const { borderTopWidth, marginTop, marginRight, marginBottom, marginLeft } = getComputedStyle(badge);
    expect(borderTopWidth).to.equal('0px');
    expect([marginTop, marginRight, marginBottom, marginLeft]).to.eql(['0px', '0px', '0px', '0px']);
  });
});
