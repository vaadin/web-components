import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { arrowDown, fixtureSync, nextFrame, nextRender, oneEvent, outsideClick } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './test-styles.test.js';
import '@vaadin/checkbox-group/src/vaadin-checkbox-group.js';
import '@vaadin/date-picker/src/vaadin-date-picker.js';
import '@vaadin/date-time-picker/src/vaadin-date-time-picker.js';
import '@vaadin/item/src/vaadin-item.js';
import '@vaadin/list-box/src/vaadin-list-box.js';
import '@vaadin/radio-group/src/vaadin-radio-group.js';
import '@vaadin/select/src/vaadin-select.js';
import '@vaadin/text-field/src/vaadin-text-field.js';
import { html, render } from 'lit';
import { untilOverlayRendered } from '@vaadin/date-picker/test/helpers.js';
import { FieldHighlighter } from '../src/vaadin-field-highlighter.js';

async function waitForIntersectionObserver() {
  await nextFrame();
  await nextFrame();
}

describe('field components', () => {
  let field;
  let showSpy;
  let hideSpy;

  function getOutline(elem) {
    return elem.shadowRoot.querySelector('[part="outline"]');
  }

  async function open(elem) {
    const overlay = elem.$.overlay || elem._overlayElement;
    arrowDown(elem.focusElement);
    await oneEvent(overlay, 'vaadin-overlay-open');
  }

  describe('text field', () => {
    beforeEach(async () => {
      field = fixtureSync(`<vaadin-text-field></vaadin-text-field>`);
      FieldHighlighter.init(field);
      showSpy = sinon.spy();
      hideSpy = sinon.spy();
      field.addEventListener('vaadin-highlight-show', showSpy);
      field.addEventListener('vaadin-highlight-hide', hideSpy);
      await waitForIntersectionObserver();
    });

    it('should dispatch vaadin-highlight-show event on focus', () => {
      field.focus();
      expect(showSpy.callCount).to.equal(1);
    });

    it('should dispatch vaadin-highlight-hide event on blur', () => {
      field.focus();
      field.blur();
      expect(hideSpy.callCount).to.equal(1);
    });
  });

  describe('date picker', () => {
    beforeEach(async () => {
      field = fixtureSync(`<vaadin-date-picker></vaadin-date-picker>`);
      FieldHighlighter.init(field);
      showSpy = sinon.spy();
      hideSpy = sinon.spy();
      field.addEventListener('vaadin-highlight-show', showSpy);
      field.addEventListener('vaadin-highlight-hide', hideSpy);
      await waitForIntersectionObserver();
    });

    describe('default', () => {
      it('should dispatch vaadin-highlight-show event on focus', () => {
        field.focus();
        expect(showSpy.callCount).to.equal(1);
      });

      it('should dispatch vaadin-highlight-hide event on blur', () => {
        field.focus();
        field.blur();
        expect(hideSpy.callCount).to.equal(1);
      });

      it('should not dispatch vaadin-highlight-hide event on open', async () => {
        field.focus();
        await open(field);
        await untilOverlayRendered(field);
        expect(hideSpy.callCount).to.equal(0);
      });

      it('should not dispatch vaadin-highlight-hide event on close without blur', async () => {
        field.focus();
        await open(field);
        await untilOverlayRendered(field);
        field.close();
        expect(hideSpy.callCount).to.equal(0);
      });

      it('should not dispatch vaadin-highlight-hide event on close with focus moved to the field', async () => {
        await open(field);
        await untilOverlayRendered(field);

        field.focus();
        field.close();

        expect(hideSpy.callCount).to.equal(0);
      });

      it('should not dispatch vaadin-highlight-hide event on re-focusing field', async () => {
        field.focus();
        await open(field);
        await untilOverlayRendered(field);

        await field._overlayContent.focusDateElement();
        field.focus();
        await nextRender();

        expect(hideSpy.callCount).to.equal(0);
      });

      it('should not dispatch second vaadin-highlight-show event on re-focusing field', async () => {
        field.focus();
        await open(field);
        await untilOverlayRendered(field);

        await field._overlayContent.focusDateElement();
        field.focus();
        await nextRender();

        expect(showSpy.callCount).to.equal(1);
      });

      it('should not dispatch vaadin-highlight-hide event on field blur if opened', async () => {
        field.focus();
        await open(field);
        await untilOverlayRendered(field);

        field.blur();
        field.focus();
        await nextRender();

        expect(hideSpy.callCount).to.equal(0);
      });

      it('should dispatch vaadin-highlight-hide event on close after blur', async () => {
        field.focus();
        await open(field);
        await untilOverlayRendered(field);

        await field._overlayContent.focusDateElement();
        outsideClick();
        await nextRender();

        expect(hideSpy.callCount).to.equal(1);
      });
    });

    describe('fullscreen', () => {
      beforeEach(() => {
        field._fullscreen = true;
      });

      it('should dispatch vaadin-highlight-show event on open', async () => {
        field.focus();
        field.click();
        await untilOverlayRendered(field);
        expect(showSpy.callCount).to.equal(1);
      });
    });
  });

  describe('select', () => {
    beforeEach(async () => {
      field = fixtureSync(`<vaadin-select></vaadin-select>`);
      field.renderer = (root) => {
        if (root.firstChild) {
          return;
        }

        render(
          html`
            <vaadin-list-box>
              <vaadin-item>Foo</vaadin-item>
              <vaadin-item>Bar</vaadin-item>
              <vaadin-item>Baz</vaadin-item>
            </vaadin-list-box>
          `,
          root,
        );
      };
      FieldHighlighter.init(field);
      showSpy = sinon.spy();
      hideSpy = sinon.spy();
      field.addEventListener('vaadin-highlight-show', showSpy);
      field.addEventListener('vaadin-highlight-hide', hideSpy);
      await waitForIntersectionObserver();
    });

    afterEach(async () => {
      await resetMouse();
    });

    it('should dispatch vaadin-highlight-show event on focus', () => {
      field.focus();
      expect(showSpy.callCount).to.equal(1);
    });

    it('should dispatch vaadin-highlight-hide event on blur', () => {
      field.focus();
      field.blur();
      expect(hideSpy.callCount).to.equal(1);
    });

    it('should not dispatch vaadin-highlight-hide event on open', async () => {
      field.focus();
      await open(field);
      expect(hideSpy.callCount).to.equal(0);
    });

    it('should not dispatch vaadin-highlight-hide event on select', async () => {
      field.focus();
      await open(field);

      // Click on the focused item
      await sendMouseToElement({ type: 'click', element: document.activeElement });
      await nextRender();

      expect(hideSpy.callCount).to.equal(0);
    });

    it('should not dispatch vaadin-highlight-hide event on outside click', async () => {
      field.focus();
      await open(field);

      await sendMouse({ type: 'click', position: [200, 200] });
      await nextRender();

      expect(hideSpy.callCount).to.equal(0);
    });

    it('should not dispatch second vaadin-highlight-show event on outside click', async () => {
      field.focus();
      await open(field);

      await sendMouse({ type: 'click', position: [200, 200] });
      await nextRender();

      expect(showSpy.callCount).to.equal(1);
    });
  });

  describe('checkbox group', () => {
    let checkboxes;

    beforeEach(async () => {
      field = fixtureSync(`
        <vaadin-checkbox-group>
          <vaadin-checkbox value="1" label="Checkbox 1"></vaadin-checkbox>
          <vaadin-checkbox value="2" label="Checkbox 2"></vaadin-checkbox>
          <vaadin-checkbox value="3" label="Checkbox 3"></vaadin-checkbox>
        </vaadin-checkbox-group>
      `);
      FieldHighlighter.init(field);
      showSpy = sinon.spy();
      hideSpy = sinon.spy();
      field.addEventListener('vaadin-highlight-show', showSpy);
      field.addEventListener('vaadin-highlight-hide', hideSpy);
      checkboxes = Array.from(field.children);
      await waitForIntersectionObserver();
    });

    it('should dispatch vaadin-highlight-show event on checkbox focus', () => {
      checkboxes[0].focus();
      expect(showSpy.callCount).to.equal(1);
      expect(showSpy.firstCall.args[0].detail.fieldIndex).to.equal(0);
    });

    it('should dispatch vaadin-highlight-hide event on checkbox blur', () => {
      checkboxes[0].focus();
      checkboxes[0].blur();
      expect(hideSpy.callCount).to.equal(1);
      expect(hideSpy.firstCall.args[0].detail.fieldIndex).to.equal(0);
    });

    it('should dispatch vaadin-highlight-hide event on other checkbox focus', async () => {
      checkboxes[0].focus();
      await sendKeys({ press: 'Tab' });
      expect(hideSpy.callCount).to.equal(1);
      expect(hideSpy.firstCall.args[0].detail.fieldIndex).to.equal(0);
    });

    it('should dispatch second vaadin-highlight-show event on other checkbox focus', async () => {
      checkboxes[0].focus();
      await sendKeys({ press: 'Tab' });
      expect(showSpy.callCount).to.equal(2);
      expect(showSpy.getCalls()[1].args[0].detail.fieldIndex).to.equal(1);
    });

    it('should set outline on multiple checkboxes based on the fieldIndex', () => {
      const user1 = { id: 'a', name: 'foo', fieldIndex: 0 };
      const user2 = { id: 'b', name: 'var', fieldIndex: 1 };
      FieldHighlighter.setUsers(field, [user1, user2]);
      expect(getComputedStyle(getOutline(checkboxes[0])).opacity).to.equal('1');
      expect(getComputedStyle(getOutline(checkboxes[1])).opacity).to.equal('1');
      expect(getComputedStyle(getOutline(checkboxes[2])).opacity).to.equal('0');
    });
  });

  describe('radio group', () => {
    let radios;

    beforeEach(async () => {
      field = fixtureSync(`
        <vaadin-radio-group>
          <vaadin-radio-button value="1" label="Radio 1"></vaadin-radio-button>
          <vaadin-radio-button value="2" label="Radio 2"></vaadin-radio-button>
          <vaadin-radio-button value="3" label="Radio 3"></vaadin-radio-button>
        </vaadin-radio-group>
      `);
      FieldHighlighter.init(field);
      showSpy = sinon.spy();
      hideSpy = sinon.spy();
      field.addEventListener('vaadin-highlight-show', showSpy);
      field.addEventListener('vaadin-highlight-hide', hideSpy);
      radios = Array.from(field.children);
      await waitForIntersectionObserver();
    });

    it('should dispatch vaadin-highlight-show event on checkbox focus', () => {
      radios[0].focus();
      expect(showSpy.callCount).to.equal(1);
      expect(showSpy.firstCall.args[0].detail.fieldIndex).to.equal(0);
    });

    it('should dispatch vaadin-highlight-hide event on checkbox blur', () => {
      radios[0].focus();
      radios[0].blur();
      expect(hideSpy.callCount).to.equal(1);
      expect(hideSpy.firstCall.args[0].detail.fieldIndex).to.equal(0);
    });

    it('should dispatch vaadin-highlight-hide event on other radio focus', async () => {
      radios[0].focus();
      await sendKeys({ press: 'ArrowRight' });
      expect(hideSpy.callCount).to.equal(1);
      expect(hideSpy.firstCall.args[0].detail.fieldIndex).to.equal(0);
    });

    it('should dispatch second vaadin-highlight-show event on other radio focus', async () => {
      radios[0].focus();
      await sendKeys({ press: 'ArrowRight' });
      expect(showSpy.callCount).to.equal(2);
      expect(showSpy.getCalls()[1].args[0].detail.fieldIndex).to.equal(1);
    });

    it('should set outline on multiple radios based on the fieldIndex', () => {
      const user1 = { id: 'a', name: 'foo', fieldIndex: 0 };
      const user2 = { id: 'b', name: 'var', fieldIndex: 1 };
      FieldHighlighter.setUsers(field, [user1, user2]);
      expect(getComputedStyle(getOutline(radios[0])).opacity).to.equal('1');
      expect(getComputedStyle(getOutline(radios[1])).opacity).to.equal('1');
      expect(getComputedStyle(getOutline(radios[2])).opacity).to.equal('0');
    });
  });

  describe('date time picker', () => {
    let date;
    let time;

    beforeEach(async () => {
      field = fixtureSync(`<vaadin-date-time-picker></vaadin-date-time-picker>`);
      FieldHighlighter.init(field);
      date = field.querySelector('vaadin-date-picker');
      time = field.querySelector('vaadin-time-picker');
      showSpy = sinon.spy();
      hideSpy = sinon.spy();
      field.addEventListener('vaadin-highlight-show', showSpy);
      field.addEventListener('vaadin-highlight-hide', hideSpy);
      await waitForIntersectionObserver();
    });

    afterEach(() => {
      if (date.opened) {
        date.close();
      }
    });

    it('should dispatch vaadin-highlight-show event on date picker focus', () => {
      date.focus();
      expect(showSpy.callCount).to.equal(1);
    });

    it('should dispatch vaadin-highlight-hide event on date picker blur', () => {
      date.focus();
      date.blur();
      expect(hideSpy.callCount).to.equal(1);
    });

    it('should dispatch vaadin-highlight-show event on time picker focus', () => {
      time.focus();
      expect(showSpy.callCount).to.equal(1);
    });

    it('should dispatch vaadin-highlight-hide event on time picker blur', () => {
      time.focus();
      time.blur();
      expect(hideSpy.callCount).to.equal(1);
    });

    it('should dispatch vaadin-highlight-hide event on Tab to time picker', async () => {
      date.focus();
      await sendKeys({ press: 'Tab' });
      expect(hideSpy.callCount).to.equal(1);
      expect(hideSpy.firstCall.args[0].detail.fieldIndex).to.equal(0);
    });

    it('should dispatch second vaadin-highlight-show event on Tab to time picker', async () => {
      date.focus();
      await sendKeys({ press: 'Tab' });
      expect(showSpy.callCount).to.equal(2);
      expect(showSpy.getCalls()[1].args[0].detail.fieldIndex).to.equal(1);
    });

    it('should dispatch vaadin-highlight-hide event on Shift Tab to date picker', async () => {
      time.focus();
      await sendKeys({ press: 'Shift+Tab' });
      expect(hideSpy.callCount).to.equal(1);
      expect(hideSpy.firstCall.args[0].detail.fieldIndex).to.equal(1);
    });

    it('should dispatch second vaadin-highlight-show event on Shift Tab to date picker', async () => {
      time.focus();
      await sendKeys({ press: 'Shift+Tab' });
      expect(showSpy.callCount).to.equal(2);
      expect(showSpy.getCalls()[1].args[0].detail.fieldIndex).to.equal(0);
    });

    it('should dispatch vaadin-highlight-hide event on overlay focusout to time picker', async () => {
      date.focus();
      await open(date);
      await untilOverlayRendered(field);

      // Focus date element and then time-picker
      await date._overlayContent.focusDateElement();
      time.focus();
      date.close();

      expect(hideSpy.callCount).to.equal(1);
      expect(hideSpy.firstCall.args[0].detail.fieldIndex).to.equal(0);
    });

    it('should set outline on both date and time pickers based on the fieldIndex', () => {
      const user1 = { id: 'a', name: 'foo', fieldIndex: 0 };
      const user2 = { id: 'b', name: 'var', fieldIndex: 1 };
      FieldHighlighter.setUsers(field, [user1, user2]);
      expect(getComputedStyle(getOutline(date)).opacity).to.equal('1');
      expect(getComputedStyle(getOutline(time)).opacity).to.equal('1');
    });
  });

  describe('list-box', () => {
    let items;

    beforeEach(async () => {
      field = fixtureSync(`
        <vaadin-list-box>
          <vaadin-item>Option 1</vaadin-item>
          <vaadin-item>Option 2</vaadin-item>
          <vaadin-item>Option 3</vaadin-item>
        </vaadin-list-box>
      `);
      await nextFrame();
      FieldHighlighter.init(field);
      items = field.items;
      showSpy = sinon.spy();
      hideSpy = sinon.spy();
      field.addEventListener('vaadin-highlight-show', showSpy);
      field.addEventListener('vaadin-highlight-hide', hideSpy);
      await waitForIntersectionObserver();
    });

    it('should dispatch vaadin-highlight-show event on item focus', () => {
      items[0].focus();
      expect(showSpy.callCount).to.equal(1);
      expect(showSpy.firstCall.args[0].detail.fieldIndex).to.equal(0);
    });

    it('should dispatch vaadin-highlight-hide event on item blur', () => {
      items[0].focus();
      items[0].blur();
      expect(hideSpy.callCount).to.equal(1);
      expect(hideSpy.firstCall.args[0].detail.fieldIndex).to.equal(0);
    });

    it('should dispatch vaadin-highlight-hide event on other item focus', async () => {
      items[0].focus();
      await sendKeys({ press: 'ArrowDown' });
      expect(hideSpy.callCount).to.equal(1);
      expect(hideSpy.firstCall.args[0].detail.fieldIndex).to.equal(0);
    });

    it('should dispatch second vaadin-highlight-show event on other item focus', async () => {
      items[0].focus();
      await sendKeys({ press: 'ArrowDown' });
      expect(showSpy.callCount).to.equal(2);
      expect(showSpy.getCalls()[1].args[0].detail.fieldIndex).to.equal(1);
    });

    it('should set outline on multiple items based on the fieldIndex', () => {
      const user1 = { id: 'a', name: 'foo', fieldIndex: 0 };
      const user2 = { id: 'b', name: 'var', fieldIndex: 1 };
      FieldHighlighter.setUsers(field, [user1, user2]);
      expect(getComputedStyle(getOutline(items[0])).opacity).to.equal('1');
      expect(getComputedStyle(getOutline(items[1])).opacity).to.equal('1');
      expect(getComputedStyle(getOutline(items[2])).opacity).to.equal('0');
    });
  });
});
