import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';

function loadCSS(href) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.addEventListener('load', resolve);
    link.addEventListener('error', reject);
    document.head.appendChild(link);
  });
}

describe('input-container', () => {
  before(async () => {
    await loadCSS('/packages/aura/aura.css');
  });

  describe('--vaadin-input-field-error-color', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = fixtureSync(`
        <div style="--vaadin-input-field-error-color: rgb(1, 2, 3)">
          <span></span>
          <span theme="small"></span>
        </div>
      `);
    });

    ['', 'small'].forEach((theme) => {
      it(`should inherit value set on parent ${theme ? `with theme="${theme}"` : 'without theme'}`, () => {
        const element = wrapper.querySelector(theme ? `[theme="${theme}"]` : 'span:not([theme])');
        const value = getComputedStyle(element).getPropertyValue('--vaadin-input-field-error-color').trim();
        expect(value).to.equal('rgb(1, 2, 3)');
      });
    });
  });
});
