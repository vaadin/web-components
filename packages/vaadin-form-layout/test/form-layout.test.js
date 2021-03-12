import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@vaadin/vaadin-text-field/vaadin-text-field.js';
import '../vaadin-form-layout.js';
import '../vaadin-form-item.js';

customElements.define(
  'mutable-layout',
  class extends PolymerElement {
    static get template() {
      return html`
        <vaadin-form-layout>
          <vaadin-form-item>
            <label slot="label">Address</label>
            <input class="full-width" />
          </vaadin-form-item>
          <vaadin-form-item>
            <label slot="label">First Name</label>
            <input class="full-width" value="Jane" />
          </vaadin-form-item>
          <template is="dom-repeat" items="[[items]]">
            <vaadin-form-item colspan$="[[item.colspan]]">
              <label slot="label">[[item.label]]</label>
              <input class="full-width" />
            </vaadin-form-item>
          </template>
        </vaadin-form-layout>
      `;
    }
    static get properties() {
      return {
        items: {
          type: Array,
          value: () => []
        }
      };
    }
  }
);

function nextRender(el) {
  return new Promise((resolve) => {
    afterNextRender(el, resolve);
  });
}

function getParsedWidth(el) {
  const width = el.style.getPropertyValue('width');
  const components = width.replace(/^calc\((.*)\)$/, '$1').split(/ [+-] /);
  const [percentage, spacing] = components.sort((a, b) => b.indexOf('%'));
  return { percentage, spacing };
}

describe('form layout', () => {
  describe('basic features', () => {
    let layout;

    beforeEach(() => {
      layout = fixtureSync(`
        <vaadin-form-layout>
          <vaadin-text-field></vaadin-text-field>
          <vaadin-form-item></vaadin-form-item>
        </vaadin-form-layout>
      `);
    });

    it('should have slot', () => {
      expect(layout.shadowRoot.querySelector('slot')).to.be.ok;
    });

    it('should have max-width set to 100%', () => {
      expect(getComputedStyle(layout).getPropertyValue('max-width')).to.be.oneOf([
        '900px', // some browsers (IE, Safari) return px computed style
        '100%'
      ]);
    });

    it('should distribute vaadin-text-field', () => {
      const textField = layout.querySelector('vaadin-text-field');
      const slot = layout.shadowRoot.querySelector('slot');
      expect(textField).to.be.ok;
      expect(slot.assignedNodes()).to.contain(textField);
    });
  });

  describe('CSS properties', () => {
    let layout;

    beforeEach(() => {
      layout = fixtureSync(`
        <vaadin-form-layout>
          <vaadin-text-field></vaadin-text-field>
          <vaadin-form-item></vaadin-form-item>
        </vaadin-form-layout>
      `);
    });

    it('should apply default column-spacing', () => {
      // override to not depend on the theme changes
      layout.updateStyles({ '--lumo-space-l': '2rem' });

      expect(getParsedWidth(layout.firstElementChild).spacing).to.equal('1rem');
      expect(getComputedStyle(layout.firstElementChild).getPropertyValue('margin-left')).to.equal('0px'); // zero because it's first
      expect(getComputedStyle(layout.firstElementChild).getPropertyValue('margin-right')).to.equal('16px'); // 0.5 * 2rem in px
    });

    it('should support updating with `updateStyles` call', () => {
      layout.updateStyles({
        '--vaadin-form-layout-column-spacing': '2rem',
        '--vaadin-form-layout-label-width': '4rem',
        '--vaadin-form-layout-label-spacing': '1rem'
      });
      expect(getParsedWidth(layout.firstElementChild).spacing).to.equal('1rem');
      expect(getComputedStyle(layout).getPropertyValue('--vaadin-form-layout-label-width')).to.equal('4rem');
      expect(getComputedStyle(layout).getPropertyValue('--vaadin-form-layout-label-spacing')).to.equal('1rem');
    });
  });

  describe('colspan', () => {
    let layout;

    beforeEach(() => {
      layout = fixtureSync(`
        <vaadin-form-layout responsive-steps='[{"columns": 3}]'>
          <vaadin-text-field></vaadin-text-field>
          <vaadin-text-field colspan="1"></vaadin-text-field>
          <vaadin-text-field colspan="2"></vaadin-text-field>
          <vaadin-text-field colspan="3"></vaadin-text-field>
          <vaadin-text-field colspan="4"></vaadin-text-field>
          <vaadin-text-field colspan="non-number"></vaadin-text-field>
        </vaadin-form-layout>
      `);
    });

    function estimateEffectiveColspan(el) {
      return parseFloat(getParsedWidth(el).percentage) / (100 / 3);
    }

    it('should span children correctly', () => {
      // empty means 1
      expect(estimateEffectiveColspan(layout.children[0])).to.be.closeTo(1, 0.1);

      // correct values
      expect(estimateEffectiveColspan(layout.children[1])).to.be.closeTo(1, 0.1);
      expect(estimateEffectiveColspan(layout.children[2])).to.be.closeTo(2, 0.1);
      expect(estimateEffectiveColspan(layout.children[3])).to.be.closeTo(3, 0.1);

      // if more then a number of columns, use number of columns
      expect(estimateEffectiveColspan(layout.children[4])).to.be.closeTo(3, 0.1);

      // invalid means 1
      expect(estimateEffectiveColspan(layout.children[5])).to.be.closeTo(1, 0.1);
    });
  });

  describe('container overflow', () => {
    let container, layout;

    beforeEach(() => {
      container = fixtureSync(`
      <div style="width: 300px; overflow: auto;">
          <vaadin-form-layout responsive-steps='[{"columns": 3}]'>
            <div at-start>1 start</div>
            <div>2 mid</div>
            <div at-end>3 end</div>
            <br>
            <div style="display: none;">invisible</div>
            <div at-start colspan="2">4 start</div>
            <div style="display: none;">invisible</div>
            <br>
            <div at-start>5 start</div>
            <div colspan="2" at-end>6 end</div>
            <div colspan="2" at-start>7 start</div>
            <div at-end>8 end</div>
            <div colspan="3" at-start at-end>9 start to end</div>
          </vaadin-form-layout>
        </div>
      `);
      layout = container.firstElementChild;
    });

    it('should not overflow containers horizontally', () => {
      expect(container.scrollWidth).to.equal(container.clientWidth);
    });

    it('should maintain the colspan value before the line break', () => {
      const secondItemRect = layout.children[1].getBoundingClientRect();
      const fourthItemRect = layout.children[5].getBoundingClientRect();
      expect(secondItemRect.right).to.be.closeTo(fourthItemRect.right, 0.5);
    });

    describe('no spacing on edges', () => {
      it('should not have spacing on the left edge', () => {
        const containerRect = container.getBoundingClientRect();
        Array.from(layout.querySelectorAll('[at-start]')).forEach((child) => {
          expect(child.getBoundingClientRect().left).to.be.closeTo(containerRect.left, 0.5);
        });
      });

      it('should not have spacing on the right edge', () => {
        const containerRect = container.getBoundingClientRect();
        Array.from(layout.querySelectorAll('[at-end]')).forEach((child) => {
          expect(child.getBoundingClientRect().right).to.be.closeTo(containerRect.right, 0.5);
        });
      });
    });

    describe('no spacing on edges (rtl)', () => {
      beforeEach(() => {
        container.dir = 'rtl';
        layout.updateStyles();
      });

      it('should not have spacing on the right edge', () => {
        const containerRect = container.getBoundingClientRect();
        Array.from(layout.querySelectorAll('[at-start]')).forEach((child) => {
          expect(child.getBoundingClientRect().right).to.be.closeTo(containerRect.right, 0.5);
        });
      });

      it('should not have spacing on the left edge', () => {
        const containerRect = container.getBoundingClientRect();
        Array.from(layout.querySelectorAll('[at-end]')).forEach((child) => {
          expect(child.getBoundingClientRect().left).to.be.closeTo(containerRect.left, 0.5);
        });
      });
    });
  });

  describe('responsiveSteps property', () => {
    var layout;

    beforeEach(() => {
      layout = fixtureSync(`
        <vaadin-form-layout>
          <vaadin-text-field></vaadin-text-field>
          <vaadin-text-field></vaadin-text-field>
          <vaadin-form-item></vaadin-form-item>
        </vaadin-form-layout>
      `);
    });

    it('should have default value', () => {
      expect(layout.responsiveSteps).to.deep.equal([
        { minWidth: 0, columns: 1, labelsPosition: 'top' },
        { minWidth: '20em', columns: 1 },
        { minWidth: '40em', columns: 2 }
      ]);
    });

    it('should assign width inline style on items', () => {
      layout.responsiveSteps = [{ columns: 3 }];

      const parsedWidth = getParsedWidth(layout.firstElementChild);
      expect(parsedWidth.percentage).to.match(/%$/);
      expect(parseFloat(parsedWidth.percentage)).to.be.closeTo(33, 0.5);
    });

    it('should set label-position attribute to child form-item elements', () => {
      layout.responsiveSteps = [{ columns: 1 }];

      expect(layout.children[0].getAttribute('label-position')).to.be.null;
      expect(layout.children[1].getAttribute('label-position')).to.be.null;
      expect(layout.children[2].getAttribute('label-position')).to.be.null;

      layout.responsiveSteps = [{ columns: 1, labelsPosition: 'top' }];

      expect(layout.children[0].getAttribute('label-position')).to.be.null;
      expect(layout.children[1].getAttribute('label-position')).to.be.null;
      expect(layout.children[2].getAttribute('label-position')).to.equal('top');
    });

    describe('responsive', () => {
      beforeEach(() => {
        document.body.style.minWidth = '0';
      });

      afterEach(() => {
        document.body.style.removeProperty('width');
        document.body.style.removeProperty('min-width');
      });

      function estimateEffectiveColumnCount(layout) {
        return 100 / parseFloat(getParsedWidth(layout.firstElementChild).percentage);
      }

      it('should be responsive by default', () => {
        document.body.style.width = '10em';
        layout.dispatchEvent(new CustomEvent('iron-resize'));
        expect(estimateEffectiveColumnCount(layout)).to.be.closeTo(1, 0.1);
        expect(layout.children[2].getAttribute('label-position')).to.equal('top');

        document.body.style.width = '20em';
        layout.dispatchEvent(new CustomEvent('iron-resize'));
        expect(estimateEffectiveColumnCount(layout)).to.be.closeTo(1, 0.1);
        expect(layout.children[2].getAttribute('label-position')).to.be.null;

        document.body.style.width = '40em';
        layout.dispatchEvent(new CustomEvent('iron-resize'));
        expect(estimateEffectiveColumnCount(layout)).to.be.closeTo(2, 0.1);
        expect(layout.children[2].getAttribute('label-position')).to.be.null;
      });

      it('should allow specifying non-responsive', () => {
        layout.responsiveSteps = [{ columns: 3 }];

        document.body.style.width = '10em';
        layout.dispatchEvent(new CustomEvent('iron-resize'));
        expect(estimateEffectiveColumnCount(layout)).to.be.closeTo(3, 0.1);
        expect(layout.children[2].getAttribute('label-position')).to.be.null;

        document.body.style.width = '20em';
        layout.dispatchEvent(new CustomEvent('iron-resize'));
        expect(estimateEffectiveColumnCount(layout)).to.be.closeTo(3, 0.1);
        expect(layout.children[2].getAttribute('label-position')).to.be.null;

        document.body.style.width = '40em';
        layout.dispatchEvent(new CustomEvent('iron-resize'));
        expect(estimateEffectiveColumnCount(layout)).to.be.closeTo(3, 0.1);
        expect(layout.children[2].getAttribute('label-position')).to.be.null;
      });

      it('should allow specifying more steps', () => {
        layout.responsiveSteps = [
          { columns: 1 },
          { minWidth: '20em', columns: 2, labelsPosition: 'top' },
          { minWidth: '40em', columns: 5 }
        ];

        document.body.style.width = '10em';
        layout.dispatchEvent(new CustomEvent('iron-resize'));
        expect(estimateEffectiveColumnCount(layout)).to.be.closeTo(1, 0.1);
        expect(layout.children[2].getAttribute('label-position')).to.be.null;

        document.body.style.width = '20em';
        layout.dispatchEvent(new CustomEvent('iron-resize'));
        expect(estimateEffectiveColumnCount(layout)).to.be.closeTo(2, 0.1);
        expect(layout.children[2].getAttribute('label-position')).to.equal('top');

        document.body.style.width = '40em';
        layout.dispatchEvent(new CustomEvent('iron-resize'));
        expect(estimateEffectiveColumnCount(layout)).to.be.closeTo(5, 0.1);
        expect(layout.children[2].getAttribute('label-position')).to.be.null;
      });
    });

    describe('value validation', () => {
      beforeEach(() => {
        sinon.stub(console, 'warn');
      });

      afterEach(() => {
        console.warn.restore();
      });

      const invalidValues = [
        undefined,
        null,
        '',
        'foo',
        0,
        1,
        {}, // array value is required
        [], // at least one step is required
        [{ columns: undefined }], // columns key is required
        [{ columns: -1 }], // columns requires natural number
        [{ columns: 0 }], // columns requires natural number
        [{ columns: 0.5 }], // columns requires natural number
        [{ minWidth: '10', columns: 1 }], // minWidth requires valid CSS length string
        [{ columns: 1, minWidth: '480px', labelsPosition: null }], // labelsPosition should be a string
        [{ columns: 1, minWidth: '480px', labelsPosition: 'foo' }] // labelsPosition should be in supported list
      ];

      const validValues = [
        [{ columns: 1 }],
        [{ columns: 1, minWidth: 0 }],
        [{ columns: 1, minWidth: '480px' }],
        [{ columns: 1, minWidth: '480px', labelsPosition: 'aside' }],
        [{ columns: 1, minWidth: '480px', labelsPosition: 'top' }]
      ];

      it('should warn for invalid values', () => {
        invalidValues.forEach((value) => {
          layout.responsiveSteps = value;
          expect(console.warn.called).to.be.true;
          expect(console.warn.args[0][0]).to.contain('Invalid');
        });
      });

      it('should not warn for valid values', () => {
        validValues.forEach((value) => {
          layout.responsiveSteps = value;
          expect(console.warn.called).to.be.false;
        });
      });

      it('should use default value for invalid values', () => {
        invalidValues.forEach((value) => {
          layout.responsiveSteps = value;
          expect(layout.responsiveSteps).to.deep.equal([
            { minWidth: 0, columns: 1, labelsPosition: 'top' },
            { minWidth: '20em', columns: 1 },
            { minWidth: '40em', columns: 2 }
          ]);
        });
      });

      it('should use previous valid value for values', () => {
        invalidValues.forEach((value) => {
          layout.responsiveSteps = [{ columns: 1 }];
          layout.responsiveSteps = value;
          expect(layout.responsiveSteps).to.deep.equal([{ columns: 1 }]);
        });
      });

      it('should not change for valid values', () => {
        validValues.forEach((value) => {
          layout.responsiveSteps = value;
          expect(layout.responsiveSteps).to.equal(value);
        });
      });
    });
  });

  describe('flex child', () => {
    let container, layout;

    beforeEach(() => {
      container = fixtureSync(`
        <div style="display: flex;">
          <div>Foo</div>
          <vaadin-form-layout>
            <vaadin-text-field></vaadin-text-field>
            <br>
            <vaadin-text-field></vaadin-text-field>
          </vaadin-form-layout>
        </div>
      `);
      layout = container.querySelector('vaadin-form-layout');
    });

    it('should have less width than then flexbox', () => {
      const containerRect = container.getBoundingClientRect();
      const layoutRect = layout.getBoundingClientRect();
      expect(layoutRect.width).to.be.below(containerRect.width);
    });
  });

  describe('hidden', () => {
    let container, layout;

    beforeEach(() => {
      container = fixtureSync(`
        <div hidden>
          <vaadin-form-layout></vaadin-form-layout>
        </div>
      `);
      layout = container.querySelector('vaadin-form-layout');
    });

    it('should update steps on show after hidden', (done) => {
      const spy = sinon.spy(layout, '_selectResponsiveStep');
      layout.addEventListener('animationend', () => {
        expect(spy.called).to.be.true;
        done();
      });

      container.hidden = false;
    });

    it('should not update steps on custom animation name', (done) => {
      const spy = sinon.spy(layout, '_selectResponsiveStep');
      layout.addEventListener('animationend', () => {
        expect(spy.called).to.be.false;
        done();
      });

      const ev = new Event('animationend');
      ev.animationName = 'foo';
      layout.dispatchEvent(ev);
    });
  });

  describe('mutations', () => {
    let container, layout;

    beforeEach(async () => {
      container = fixtureSync('<mutable-layout></mutable-layout>');
      layout = container.shadowRoot.querySelector('vaadin-form-layout');
      await nextRender(container);
    });

    function estimateEffectiveColspan(el) {
      return parseFloat(getParsedWidth(el).percentage) / (100 / 2);
    }

    it('should update layout after updating a colspan attribute', async () => {
      expect(estimateEffectiveColspan(layout.children[0])).to.be.closeTo(1, 0.1);

      layout.children[0].setAttribute('colspan', 2);
      await nextRender(container);
      expect(estimateEffectiveColspan(layout.children[0])).to.be.closeTo(2, 0.1);
    });

    it('should update style if hidden property of layout-item is changed and the element has not had style yet', async () => {
      const itemWidth = layout.children[0].getBoundingClientRect().width;
      expect(itemWidth).to.be.above(0);

      const newFormItem = document.createElement('vaadin-form-item');
      newFormItem.hidden = true;
      layout.appendChild(newFormItem);
      await nextRender(container);
      expect(newFormItem.getBoundingClientRect().width).to.equal(0);

      newFormItem.hidden = false;
      await nextRender(container);
      const unhiddenItemWidth = newFormItem.getBoundingClientRect().width;
      expect(unhiddenItemWidth).to.equal(itemWidth);
    });

    it('should update layout after updating a colspan attribute on the lazily stamped node', async () => {
      container.push('items', { label: 'Email', colspan: 1 });
      await nextRender(container);
      const item = layout.querySelectorAll('vaadin-form-item')[2];
      expect(estimateEffectiveColspan(item)).to.be.closeTo(1, 0.1);

      container.set('items.0.colspan', 2);
      await nextRender(container);
      expect(estimateEffectiveColspan(item)).to.be.closeTo(2, 0.1);
    });

    it('should update layout after a new item is added', async () => {
      const newFormItem = document.createElement('vaadin-form-item');
      newFormItem.innerHTML = '<label slot="label">Age</label><input class="full-width">';
      layout.appendChild(newFormItem);
      await nextRender(container);
      expect(getComputedStyle(newFormItem).marginLeft).to.be.equal('0px');
    });

    it('should update layout after an item is removed', async () => {
      const itemsList = layout.querySelectorAll('vaadin-form-item');
      expect(getComputedStyle(itemsList[1]).marginLeft).to.not.be.equal('0px');

      layout.removeChild(itemsList[0]);
      await nextRender(container);
      expect(getComputedStyle(itemsList[1]).marginLeft).to.be.equal('0px');
    });
  });
});
