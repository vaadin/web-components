import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextRender, nextResize } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/text-field/vaadin-text-field.js';
import '../vaadin-form-layout.js';
import '../vaadin-form-item.js';

function getParsedWidth(el) {
  const width = el.style.getPropertyValue('width');
  const components = width.replace(/^calc\((.*)\)$/u, '$1').split(/ [+-] /u);
  const [percentage, spacing] = components.sort((_a, b) => b.indexOf('%'));
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
        '900px', // Some browsers (IE, Safari) return px computed style
        '100%',
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
    let layout, item;

    beforeEach(() => {
      layout = fixtureSync(`
        <vaadin-form-layout>
          <vaadin-text-field></vaadin-text-field>
          <vaadin-form-item></vaadin-form-item>
        </vaadin-form-layout>
      `);
      item = layout.querySelector('vaadin-form-item');
    });

    it('should have default label-width', () => {
      expect(getComputedStyle(item).getPropertyValue('--vaadin-form-item-label-width').trim()).to.equal('8em');
      const labelFontSize = parseFloat(getComputedStyle(item.$.label).fontSize);
      expect(parseFloat(getComputedStyle(item.$.label).width)).to.be.closeTo(8 * labelFontSize, 0.5);
    });

    it('should apply label-width', () => {
      item.style.setProperty('--vaadin-form-item-label-width', '100px');
      expect(getComputedStyle(item.$.label).width).to.equal('100px');
    });

    it('should not apply label-width when label-position="top" attribute is set', () => {
      item.setAttribute('label-position', 'top');
      item.style.setProperty('--vaadin-form-item-label-width', '100px');
      expect(getComputedStyle(item.$.label).width).to.not.equal('100px');
    });

    it('should have default label-spacing', () => {
      expect(getComputedStyle(item).getPropertyValue('--vaadin-form-item-label-spacing').trim()).to.equal('1em');
      expect(getComputedStyle(item.$.spacing).width).to.equal('16px'); // 1em in px
    });

    it('should apply label-spacing', () => {
      item.style.setProperty('--vaadin-form-item-label-spacing', '8px');
      expect(getComputedStyle(item.$.spacing).width).to.equal('8px');
    });

    it('should not have default row-spacing', () => {
      expect(getComputedStyle(item).getPropertyValue('--vaadin-form-item-row-spacing').trim()).to.equal('0');
      expect(parseFloat(getComputedStyle(item).marginTop)).to.equal(0);
      expect(parseFloat(getComputedStyle(item).marginBottom)).to.equal(0);
    });
  });

  describe('responsiveSteps', () => {
    let layout;

    describe('basic', () => {
      beforeEach(async () => {
        layout = fixtureSync(`
          <vaadin-form-layout>
            <vaadin-text-field></vaadin-text-field>
            <vaadin-text-field></vaadin-text-field>
            <vaadin-form-item></vaadin-form-item>
          </vaadin-form-layout>
        `);
        await nextRender();
      });

      it('should have default value', () => {
        expect(layout.responsiveSteps).to.deep.equal([
          { minWidth: 0, columns: 1, labelsPosition: 'top' },
          { minWidth: '20em', columns: 1 },
          { minWidth: '40em', columns: 2 },
        ]);
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
    });

    describe('custom label-position', () => {
      beforeEach(async () => {
        layout = fixtureSync(`
          <vaadin-form-layout>
            <vaadin-text-field></vaadin-text-field>
            <vaadin-text-field></vaadin-text-field>
            <vaadin-form-item></vaadin-form-item>
            <vaadin-form-item label-position="top"></vaadin-form-item>
          </vaadin-form-layout>
        `);
        await nextRender();
      });

      it('should not remove custom label-position attribute on added form-item elements', () => {
        expect(layout.children[3].getAttribute('label-position')).to.equal('top');
      });

      it('should not remove custom label-position attribute after updating responsive steps', () => {
        layout.responsiveSteps = [{ columns: 1, labelsPosition: 'top' }];

        expect(layout.children[2].getAttribute('label-position')).to.equal('top');
        expect(layout.children[3].getAttribute('label-position')).to.equal('top');

        layout.responsiveSteps = [{ columns: 1 }];

        expect(layout.children[2].getAttribute('label-position')).to.be.null;
        expect(layout.children[3].getAttribute('label-position')).to.equal('top');
      });
    });

    describe('responsiveness', () => {
      beforeEach(async () => {
        document.body.style.minWidth = '0';

        layout = fixtureSync(`
          <vaadin-form-layout>
            <vaadin-text-field></vaadin-text-field>
            <vaadin-text-field></vaadin-text-field>
            <vaadin-form-item></vaadin-form-item>
            <vaadin-form-item></vaadin-form-item>
            <vaadin-form-item></vaadin-form-item>
          </vaadin-form-layout>
        `);
        await nextRender();
      });

      afterEach(() => {
        document.body.style.removeProperty('width');
        document.body.style.removeProperty('min-width');
      });

      function estimateEffectiveColumnCount(layout) {
        const offsets = [...layout.children]
          .filter((child) => getComputedStyle(child).display !== 'none')
          .map((child) => child.offsetLeft);
        return new Set(offsets).size;
      }

      it('should be responsive by default', async () => {
        document.body.style.width = '10em';
        await nextResize(layout);
        expect(estimateEffectiveColumnCount(layout)).to.be.closeTo(1, 0.1);
        expect(layout.children[2].getAttribute('label-position')).to.equal('top');

        document.body.style.width = '20em';
        await nextResize(layout);
        expect(estimateEffectiveColumnCount(layout)).to.be.closeTo(1, 0.1);
        expect(layout.children[2].getAttribute('label-position')).to.be.null;

        document.body.style.width = '40em';
        await nextResize(layout);
        expect(estimateEffectiveColumnCount(layout)).to.be.closeTo(2, 0.1);
        expect(layout.children[2].getAttribute('label-position')).to.be.null;
      });

      it('should allow specifying non-responsive', async () => {
        layout.responsiveSteps = [{ columns: 3 }];

        document.body.style.width = '10em';
        await aTimeout(100);
        expect(estimateEffectiveColumnCount(layout)).to.be.closeTo(3, 0.1);
        expect(layout.children[2].getAttribute('label-position')).to.be.null;

        document.body.style.width = '20em';
        await aTimeout(100);
        expect(estimateEffectiveColumnCount(layout)).to.be.closeTo(3, 0.1);
        expect(layout.children[2].getAttribute('label-position')).to.be.null;

        document.body.style.width = '40em';
        await aTimeout(100);
        expect(estimateEffectiveColumnCount(layout)).to.be.closeTo(3, 0.1);
        expect(layout.children[2].getAttribute('label-position')).to.be.null;
      });

      it('should allow specifying more steps', async () => {
        layout.responsiveSteps = [
          { columns: 1 },
          { minWidth: '20em', columns: 2, labelsPosition: 'top' },
          { minWidth: '40em', columns: 5 },
        ];

        document.body.style.width = '10em';
        await nextResize(layout);
        expect(estimateEffectiveColumnCount(layout)).to.be.closeTo(1, 0.1);
        expect(layout.children[2].getAttribute('label-position')).to.be.null;

        document.body.style.width = '20em';
        await nextResize(layout);
        expect(estimateEffectiveColumnCount(layout)).to.be.closeTo(2, 0.1);
        expect(layout.children[2].getAttribute('label-position')).to.equal('top');

        document.body.style.width = '40em';
        await nextResize(layout);
        expect(estimateEffectiveColumnCount(layout)).to.be.closeTo(5, 0.1);
        expect(layout.children[2].getAttribute('label-position')).to.be.null;
      });
    });

    describe('value validation', () => {
      beforeEach(async () => {
        layout = fixtureSync(`<vaadin-form-layout></vaadin-form-layout>`);
        await nextRender();

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
        {}, // Array value is required
        [], // At least one step is required
        [{ columns: undefined }], // Columns key is required
        [{ columns: -1 }], // Columns requires natural number
        [{ columns: 0 }], // Columns requires natural number
        [{ columns: 0.5 }], // Columns requires natural number
        [{ minWidth: '10', columns: 1 }], // MinWidth requires valid CSS length string
        [{ columns: 1, minWidth: '480px', labelsPosition: null }], // LabelsPosition should be a string
        [{ columns: 1, minWidth: '480px', labelsPosition: 'foo' }], // LabelsPosition should be in supported list
      ];

      const validValues = [
        [{ columns: 1 }],
        [{ columns: 1, minWidth: 0 }],
        [{ columns: 1, minWidth: '480px' }],
        [{ columns: 1, minWidth: '480px', labelsPosition: 'aside' }],
        [{ columns: 1, minWidth: '480px', labelsPosition: 'top' }],
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
            { minWidth: '40em', columns: 2 },
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

    beforeEach(async () => {
      container = fixtureSync(`
        <div hidden>
          <vaadin-form-layout>
            <div>Foo</div>
            <div>Bar</div>
          </vaadin-form-layout>
        </div>
      `);
      layout = container.querySelector('vaadin-form-layout');
      await nextResize(layout);
    });

    it('should update steps on show after hidden', async () => {
      const spy = sinon.spy(layout, '_selectResponsiveStep');
      await nextResize(layout);
      container.hidden = false;
      await nextResize(layout);
      expect(spy).to.be.calledOnce;
    });

    it('should update layout when its parent becomes visible', async () => {
      layout.responsiveSteps = [{ columns: 1 }];
      await nextRender();

      container.hidden = false;
      await nextResize(layout);

      expect(parseFloat(getParsedWidth(layout.children[0]).percentage)).to.be.closeTo(100, 0.1);
      expect(parseFloat(getParsedWidth(layout.children[1]).percentage)).to.be.closeTo(100, 0.1);
    });

    it('should change layout opacity when its parent becomes visible', async () => {
      expect(layout.$.layout.style.opacity).to.equal('0');

      container.hidden = false;
      await nextResize(layout);
      expect(layout.$.layout.style.opacity).to.equal('');
    });
  });

  describe('mutations', () => {
    let container, layout, items;

    beforeEach(async () => {
      container = fixtureSync(`
        <div>
          <vaadin-form-layout>
            <vaadin-form-item>
              <label slot="label">Field</label>
              <input />
            </vaadin-form-item>
            <vaadin-form-item>
              <label slot="label">Field</label>
              <input />
            </vaadin-form-item>
            <vaadin-form-item>
              <label slot="label">Field</label>
              <input />
            </vaadin-form-item>
          </vaadin-form-layout>
        </div>
      `);
      layout = container.firstElementChild;
      layout.responsiveSteps = [{ columns: 2 }];
      items = [...layout.querySelectorAll('vaadin-form-item')];
      await nextRender(container);
    });

    it('should update grid-column-end after updating a colspan attribute', async () => {
      expect(getComputedStyle(items[0]).gridColumnEnd).to.equal('span 1');

      items[0].setAttribute('colspan', 2);
      await nextRender(layout);
      expect(getComputedStyle(items[0]).gridColumnEnd).to.equal('span 2');
    });

    it('should update grid-column-end after updating a data-colspan attribute', async () => {
      expect(getComputedStyle(items[0]).gridColumnEnd).to.equal('span 1');

      items[0].setAttribute('data-colspan', 2);
      await nextRender(layout);
      expect(getComputedStyle(items[0]).gridColumnEnd).to.equal('span 2');
    });

    it('should prefer colspan attribute over data-colspan when both are set', async () => {
      items[0].setAttribute('colspan', 2);
      items[0].setAttribute('data-colspan', 1);
      await nextRender(layout);
      expect(getComputedStyle(items[0]).gridColumnEnd).to.equal('span 2');
    });

    it('should update style if hidden property of layout-item is changed and the element has not had style yet', async () => {
      const itemWidth = items[0].getBoundingClientRect().width;
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

    it('should update grid-column-start after adding <br>', async () => {
      const br = document.createElement('br');
      layout.insertBefore(br, items[1]);
      await nextRender(layout);
      expect(getComputedStyle(items[1]).gridColumnStart).to.equal('1');
    });

    it('should update grid-column-start after removing <br>', async () => {
      const br = document.createElement('br');
      layout.insertBefore(br, items[1]);
      await nextRender(layout);

      br.remove();
      await nextRender(layout);
      expect(getComputedStyle(items[1]).gridColumnStart).to.equal('auto');
    });

    it('should not update layout when setting hidden to true', async () => {
      const percent = getParsedWidth(layout.firstElementChild).percentage;

      container.hidden = true;
      await nextRender();

      expect(getParsedWidth(layout.firstElementChild).percentage).to.be.equal(percent);
    });
  });
});
