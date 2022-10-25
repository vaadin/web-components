import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '../vaadin-select.js';

describe('items', () => {
  let select, overlay, listBox;

  beforeEach(() => {
    select = fixtureSync(`<vaadin-select></vaadin-select>`);
    select.items = [{ label: 'Option 1', value: 'value-1' }];
    overlay = select.shadowRoot.querySelector('vaadin-select-overlay');
    listBox = overlay.querySelector('vaadin-select-list-box');
    select.opened = true;
  });

  it('should render items', () => {
    expect(listBox).to.be.ok;
    expect(listBox.childNodes).to.have.lengthOf(1);
    expect(listBox.childNodes[0].localName).to.equal('vaadin-select-item');
    expect(listBox.childNodes[0].textContent).to.equal('Option 1');
    expect(listBox.childNodes[0].value).to.equal('value-1');
    expect(listBox.childNodes[0].disabled).to.be.false;
  });

  it('should re-render items on items property change', () => {
    select.items = [{ label: 'New Option', value: 'new-value' }];
    expect(listBox.childNodes).to.have.lengthOf(1);
    expect(listBox.childNodes[0].textContent).to.equal('New Option');
    expect(listBox.childNodes[0].value).to.equal('new-value');
  });

  it('should re-render items on content update request', () => {
    select.items[0].value = 'new-value';
    select.requestContentUpdate();
    expect(listBox.childNodes).to.have.lengthOf(1);
    expect(listBox.childNodes[0].value).to.equal('new-value');
  });

  it('should clear the content when setting items property to an empty array', () => {
    select.items = [];
    expect(overlay.childNodes).to.be.empty;
  });

  it('should clear the content when setting items property to null', () => {
    select.items = null;
    expect(overlay.childNodes).to.be.empty;
  });

  it('should clear the content when setting items property to undefined', () => {
    select.items = undefined;
    expect(overlay.childNodes).to.be.empty;
  });

  it('should render item with a custom component', () => {
    select.items = [{ component: 'hr' }];
    expect(listBox.childNodes).to.have.lengthOf(1);
    expect(listBox.childNodes[0].localName).to.equal('hr');
  });

  it('should render disabled item', () => {
    select.items = [{ label: 'Option 1', value: 'value-1', disabled: true }];
    expect(listBox.childNodes).to.have.lengthOf(1);
    expect(listBox.childNodes[0].disabled).to.be.true;
  });

  describe('renderer', () => {
    beforeEach(() => {
      select.renderer = (root) => {
        root.textContent = 'Renderer';
      };
    });

    it('should override content with the renderer', () => {
      expect(overlay.textContent).to.equal('Renderer');
    });

    it('should render items when removing the renderer', () => {
      select.renderer = null;
      const newListBox = overlay.querySelector('vaadin-select-list-box');
      expect(newListBox).to.be.ok;
      expect(newListBox.childNodes).to.have.lengthOf(1);
      expect(newListBox.childNodes[0].textContent).to.equal('Option 1');
    });
  });
});
