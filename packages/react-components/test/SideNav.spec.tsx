import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { findByQuerySelector } from '../../../react/test/utils/findByQuerySelector.js';
import { SideNav, type SideNavElement } from '../src/SideNav.js';

describe('SideNav', () => {
  describe('boolean property', () => {
    const booleanProperties: Array<keyof typeof SideNavElement.prototype & string> = [
      'hidden',
      'collapsed',
      'draggable',
    ];

    booleanProperties.forEach((property) => {
      describe(property, () => {
        it(`should be true in the element if ${property} prop is true`, async () => {
          await render(<SideNav {...{ [property]: true }} />);
          const sideNav = await findByQuerySelector('vaadin-side-nav');
          expect(sideNav[property]).to.be.ok;
        });

        it(`should be false in the element if ${property} prop is false`, async () => {
          await render(<SideNav {...{ [property]: false }} />);
          const sideNav = await findByQuerySelector('vaadin-side-nav');
          expect(sideNav[property]).not.to.be.ok;
        });
      });
    });
  });
});
