import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-slider.js';
import type { Slider } from '../vaadin-slider.js';

describe('vaadin-slider', () => {
  let slider: Slider;

  beforeEach(() => {
    slider = fixtureSync('<vaadin-slider></vaadin-slider>');
  });

  describe('custom element definition', () => {
    let tagName: string;

    beforeEach(() => {
      tagName = slider.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect((customElements.get(tagName) as any).is).to.equal(tagName);
    });
  });

  describe('methods', () => {
    describe('stepDown', () => {
      beforeEach(() => {
        slider.value = '50';
      });

      it('should decrease value using default step if no amount specified', () => {
        slider.stepDown();
        expect(slider.value).to.equal('49');
      });

      it('should decrease value using custom step if no amount specified', () => {
        slider.step = 10;
        slider.stepDown();
        expect(slider.value).to.equal('40');
      });

      it('should decrease value using custom amount specified', () => {
        slider.stepDown(10);
        expect(slider.value).to.equal('40');
      });

      it('should not decrease value less than minimum value', () => {
        slider.stepDown(100);
        expect(slider.value).to.equal('0');
      });

      it('should dispatch change event when value is changed', () => {
        const spy = sinon.spy();
        slider.addEventListener('change', spy);
        slider.stepDown();
        expect(spy).to.be.calledOnce;
      });

      it('should not dispatch change event when value is not changed', () => {
        const spy = sinon.spy();
        slider.addEventListener('change', spy);
        slider.value = '0';
        slider.stepDown();
        expect(spy).to.not.be.called;
      });
    });

    describe('stepUp', () => {
      beforeEach(() => {
        slider.value = '50';
      });

      it('should increase value using default step if no amount specified', () => {
        slider.stepUp();
        expect(slider.value).to.equal('51');
      });

      it('should increase value using custom step if no amount specified', () => {
        slider.step = 10;
        slider.stepUp();
        expect(slider.value).to.equal('60');
      });

      it('should increase value using custom amount specified', () => {
        slider.stepUp(10);
        expect(slider.value).to.equal('60');
      });

      it('should not increase value bigger than maximum value', () => {
        slider.stepUp(100);
        expect(slider.value).to.equal('100');
      });

      it('should dispatch change event when value is changed', () => {
        const spy = sinon.spy();
        slider.addEventListener('change', spy);
        slider.stepUp();
        expect(spy).to.be.calledOnce;
      });

      it('should not dispatch change event when value is not changed', () => {
        const spy = sinon.spy();
        slider.addEventListener('change', spy);
        slider.value = '100';
        slider.stepUp();
        expect(spy).to.not.be.called;
      });
    });
  });
});
