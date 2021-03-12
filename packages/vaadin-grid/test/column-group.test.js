import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { flush } from '@polymer/polymer/lib/utils/flush.js';
import { fixtureSync } from '@open-wc/testing-helpers';
import '../vaadin-grid-column-group.js';

describe('column group', () => {
  let group, columns;

  beforeEach(() => {
    group = fixtureSync(`
      <vaadin-grid-column-group>
        <template class="header"></template>
        <template class="footer"></template>
        <vaadin-grid-column flex-grow="1" width="20%">
          <template class="header"></template>
          <template></template>
        </vaadin-grid-column>
        <vaadin-grid-column flex-grow="2" width="200px">
          <template class="header"></template>
          <template></template>
        </vaadin-grid-column>
      </vaadin-grid-column-group>
    `);
    columns = group.querySelectorAll('vaadin-grid-column');
  });

  it('should sum child column flex-grow', () => {
    expect(group.flexGrow).to.eql(3);
  });

  it('should sum child column widths', () => {
    expect(group.width).to.eql('calc(20% + 200px)');
  });

  it('should strip nested `calc` keywords', () => {
    columns[0].width = 'calc(50% + 10px)';

    expect(group.width).to.eql('calc((50% + 10px) + 200px)');
  });

  it('should react to child column flex-grow changes', () => {
    columns[0].flexGrow = 3;

    expect(group.flexGrow).to.eql(5);
  });

  it('should react to child column width changes', () => {
    columns[0].width = '10%';

    expect(group.width).to.eql('calc(10% + 200px)');
  });

  it('should get frozen when child column freezes', () => {
    columns[0].frozen = true;

    expect(group.frozen).to.be.true;
  });

  // this test is aimed for Safari 9, see #552
  it('should propagate frozen from children when attached', () => {
    const parent = group.parentElement;
    parent.removeChild(group);

    columns[0].frozen = true;

    parent.appendChild(group);
    flush();

    expect(group.frozen).to.be.true;
  });

  it('should propagate frozen to child columns', () => {
    columns[0].frozen = false;
    group.frozen = true;

    expect(columns[0].frozen).to.be.true;
    expect(columns[1].frozen).to.be.true;
  });

  it('should hide group column', () => {
    columns[0].hidden = true;
    columns[1].hidden = true;

    expect(group.hidden).to.be.true;
  });

  it('should unhide group column', () => {
    group.hidden = true;
    columns[0].hidden = false;

    expect(group.hidden).to.be.false;
  });

  it('should not unhide other columns', () => {
    group.hidden = true;
    columns[0].hidden = false;

    expect(columns[1].hidden).to.be.true;
  });

  it('should propagate hidden to child columns', () => {
    columns[0].hidden = false;
    group.hidden = true;

    expect(columns[0].hidden).to.be.true;
    expect(columns[1].hidden).to.be.true;
    expect(group.hidden).to.be.true;
  });

  it('should propagate hidden to child columns 2', () => {
    group.hidden = true;
    group.hidden = false;

    expect(columns[0].hidden).to.be.false;
    expect(columns[1].hidden).to.be.false;
    expect(group.hidden).to.be.false;
  });

  it('should hide the group', () => {
    group.removeChild(columns[0]);
    group.removeChild(columns[1]);
    flush();
    group._observer.flush();

    expect(group.hidden).to.be.true;
  });

  it('should unhide the group', () => {
    group.removeChild(columns[0]);
    group.removeChild(columns[1]);
    group._observer.flush();

    group.appendChild(columns[0]);
    group._observer.flush();

    expect(group.hidden).to.be.false;
  });

  it('should not unhide the group', () => {
    group.removeChild(columns[0]);
    group.removeChild(columns[1]);
    group._observer.flush();

    columns[0].hidden = true;
    group.appendChild(columns[0]);
    group._observer.flush();

    expect(group.hidden).to.be.true;
  });

  it('should calculate column group width after hiding a column', () => {
    columns[0].hidden = true;

    expect(group.width).to.eql('calc(200px)');
  });

  it('should calculate column group flexGrow after hiding a column', () => {
    columns[0].hidden = true;

    expect(group.flexGrow).to.eql(2);
  });

  describe('dom observing', () => {
    it('should pickup header template', () => {
      const group = document.createElement('vaadin-grid-column-group');
      const template = document.createElement('template');
      template.classList.add('header');

      group.appendChild(template);
      group._templateObserver.flush();

      expect(group._headerTemplate).to.eql(template);
    });

    it('should pickup footer template', () => {
      const group = document.createElement('vaadin-grid-column-group');
      const template = document.createElement('template');
      template.classList.add('footer');

      group.appendChild(template);
      group._templateObserver.flush();

      expect(group._footerTemplate).to.eql(template);
    });
  });

  describe('inheritance', () => {
    it('both, class and super observers, should be called', () => {
      const superSpy = sinon.spy(group, '_resizableChanged');
      const thisSpy = sinon.spy(group, '_groupResizableChanged');
      group.resizable = true;
      expect(superSpy.called).to.be.true;
      expect(thisSpy.called).to.be.true;
    });
  });
});
