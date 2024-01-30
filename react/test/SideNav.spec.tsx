import { expect, use as useChaiPlugin } from '@esm-bundle/chai';
import { render } from '@testing-library/react';
import chaiDom from 'chai-dom';
import { SideNav, SideNavElement } from '../packages/react-components/src/SideNav.js';
import { findByQuerySelector } from './utils/findByQuerySelector.js';

useChaiPlugin(chaiDom);

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
          render(<SideNav {...{ [property]: true }} />);
          const sideNav = await findByQuerySelector('vaadin-side-nav');
          expect(sideNav[property]).to.be.ok;
        });

        it(`should be false in the element if ${property} prop is false`, async () => {
          render(<SideNav {...{ [property]: false }} />);
          const sideNav = await findByQuerySelector('vaadin-side-nav');
          expect(sideNav[property]).not.to.be.ok;
        });
      });
    });
  });
});
