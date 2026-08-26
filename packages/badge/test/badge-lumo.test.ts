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

  it('should hide the border without removing the space it reserves', () => {
    const { borderTopWidth, borderTopColor, marginTop } = getComputedStyle(badge);
    expect(borderTopColor).to.equal('rgba(0, 0, 0, 0)');
    expect(borderTopWidth).to.equal('1px');
    expect(marginTop).to.equal('-1px');
  });

  it('should keep the border hidden when only the border width is set', () => {
    badge.style.setProperty('--vaadin-badge-border-width', '2px');
    const { borderTopWidth, borderTopColor } = getComputedStyle(badge);
    expect(borderTopWidth).to.equal('2px');
    expect(borderTopColor).to.equal('rgba(0, 0, 0, 0)');
  });

  it('should use the border color custom property when set', () => {
    badge.style.setProperty('--vaadin-badge-border-color', 'rgb(0, 0, 255)');
    expect(getComputedStyle(badge).borderTopColor).to.equal('rgb(0, 0, 255)');
  });
});
