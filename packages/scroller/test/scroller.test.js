import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import '../vaadin-scroller.js';

describe('vaadin-scroller', () => {
  let scroller;

  beforeEach(() => {
    scroller = fixtureSync('<vaadin-scroller></vaadin-scroller>');
  });

  describe('focus', () => {
    it('should not add focus-ring to the host on programmatic focus', () => {
      scroller.focus();
      expect(scroller.hasAttribute('focus-ring')).to.be.false;
    });

    it('should add focus-ring to the host on keyboard focus', async () => {
      await sendKeys({ press: 'Tab' });
      expect(scroller.hasAttribute('focus-ring')).to.be.true;
    });

    it('should remove focus-ring when a child node is focused', async () => {
      scroller.appendChild(document.createElement('input'));
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement.localName).to.equal('input');
      expect(scroller.hasAttribute('focus-ring')).to.be.false;
    });
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = scroller.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('scrollDirection', () => {
    it('should reflect scrollDirection to attribute', () => {
      scroller.scrollDirection = 'horizontal';
      expect(scroller.getAttribute('scroll-direction')).to.equal('horizontal');
    });

    it('should have horizontal and vertical scrollbars by default', () => {
      expect(getComputedStyle(scroller).overflowX).to.equal('auto');
      expect(getComputedStyle(scroller).overflowY).to.equal('auto');
    });

    it('should be possible to enable only vertical scrollbars', () => {
      scroller.setAttribute('scroll-direction', 'vertical');
      expect(getComputedStyle(scroller).overflowY).to.equal('auto');
      expect(getComputedStyle(scroller).overflowX).to.equal('hidden');
    });

    it('should be possible to enable only horizontal scrollbars', () => {
      scroller.setAttribute('scroll-direction', 'horizontal');
      expect(getComputedStyle(scroller).overflowX).to.equal('auto');
      expect(getComputedStyle(scroller).overflowY).to.equal('hidden');
    });

    it('should be possible to disable both direction scrollbars', () => {
      scroller.setAttribute('scroll-direction', 'none');
      expect(getComputedStyle(scroller).overflowX).to.equal('hidden');
      expect(getComputedStyle(scroller).overflowY).to.equal('hidden');
    });
  });

  describe('overflow attribute', () => {
    describe('horizontal', () => {
      beforeEach(async () => {
        scroller.scrollDirection = 'horizontal';
        scroller.style.fontSize = '15px';
        scroller.style.maxWidth = '6.75em';

        const div = document.createElement('div');
        div.textContent = 'Long text that does not fit';
        div.style.fontSize = '1.25em';
        div.style.whiteSpace = 'nowrap';
        scroller.appendChild(div);

        await nextRender();
      });

      it('should set overflow attribute to "end" when scroll is at the beginning', () => {
        expect(scroller.getAttribute('overflow')).to.equal('end');
      });

      it('should set overflow attribute to "start end" when scroll is at the middle', async () => {
        scroller.scrollLeft = 50;
        await nextFrame();
        expect(scroller.getAttribute('overflow')).to.equal('start end');
      });

      it('should set overflow attribute to "start" when scroll is at the end', async () => {
        scroller.scrollLeft = scroller.scrollWidth - scroller.clientWidth;
        await nextFrame();
        expect(scroller.getAttribute('overflow')).to.equal('start');
      });
    });
  });

  describe('vertical', () => {
    beforeEach(async () => {
      scroller.scrollDirection = 'vertical';
      scroller.style.fontSize = '15px';
      scroller.style.maxHeight = '3.75em';

      const div = document.createElement('div');
      div.innerHTML = '<div style="font-size: 1.25em;">Long<br>text<br>that<br>has<br>many<br>lines</div>';
      scroller.appendChild(div);

      await nextRender();
    });

    it('should set overflow attribute to "bottom" when scroll is at the beginning', () => {
      expect(scroller.getAttribute('overflow')).to.equal('bottom');
    });

    it('should set overflow attribute to "top bottom" when scroll is at the middle', async () => {
      scroller.scrollTop = 25;
      await nextFrame();
      expect(scroller.getAttribute('overflow')).to.equal('top bottom');
    });

    it('should set overflow attribute to "top" when scroll is at the end', async () => {
      scroller.scrollTop = scroller.scrollHeight - scroller.clientHeight;
      await nextFrame();
      expect(scroller.getAttribute('overflow')).to.equal('top');
    });
  });

  describe('scroll to', () => {
    describe('vertical', () => {
      beforeEach(() => {
        scroller.scrollDirection = 'vertical';
        scroller.style.maxHeight = '50px';
        scroller.style.maxWidth = '50px';

        const div = document.createElement('div');
        div.textContent = 'Long text that does not fit Long text that does not fit Long text that does not fit';
        scroller.appendChild(div);
      });

      it('should scroll to the bottom', () => {
        scroller.scrollToEnd();
        const scrollTopMax = scroller.scrollHeight - scroller.clientHeight;
        expect(scroller.scrollTop).to.be.closeTo(scrollTopMax, 1);
      });

      it('should scroll to the top', () => {
        scroller.scrollToEnd();
        scroller.scrollToStart();
        expect(scroller.scrollTop).to.equal(0);
      });
    });

    describe('horizontal', () => {
      beforeEach(() => {
        scroller.scrollDirection = 'horizontal';
        scroller.style.maxHeight = '50px';
        scroller.style.maxWidth = '50px';

        const div = document.createElement('div');
        div.textContent = 'Long text that does not fit Long text that does not fit Long text that does not fit';
        div.style.width = '200px';
        scroller.appendChild(div);
      });

      it('should scroll to the right', () => {
        scroller.scrollToEnd();
        const scrollMax = scroller.scrollWidth - scroller.clientWidth;
        expect(scroller.scrollLeft).to.equal(scrollMax);
        expect(scroller.scrollLeft).to.not.equal(0);
      });

      it('should scroll to the left', () => {
        expect(scroller.scrollLeft).to.equal(0);
        scroller.scrollToStart();
      });

      it('should scroll to the left', () => {
        expect(scroller.scrollLeft).to.equal(0);
        scroller.scrollToStart();
      });

      describe('text direction RLT', () => {
        beforeEach(() => {
          scroller.setAttribute('dir', 'rtl');

          // Scroll to center.
          scroller.scrollLeft = -(scroller.scrollWidth - scroller.clientWidth) / 2;
        });

        it('should scroll to the left on scroll to end', () => {
          scroller.scrollToEnd();
          const scrollMax = scroller.scrollWidth - scroller.clientWidth;
          expect(scroller.scrollLeft).to.equal(-scrollMax);
          expect(scroller.scrollLeft).to.not.equal(0);
        });

        it('should scroll to the right on scroll to start', () => {
          scroller.scrollToStart();
          expect(scroller.scrollLeft).to.equal(0);
        });

        afterEach(() => {
          scroller.removeAttribute('dir');
        });
      });
    });
  });
});
