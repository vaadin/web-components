import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { Virtualizer } from '../src/virtualizer.js';

describe('update range', () => {
  let virtualizer;
  let scrollTarget;
  let elementsContainer;
  let firstElement;
  let secondElement;
  let state;

  function init() {
    scrollTarget = fixtureSync(`
      <div style="height: 100px;">
        <div></div>
      </div>
    `);
    const scrollContainer = scrollTarget.firstElementChild;
    elementsContainer = scrollContainer;

    virtualizer = new Virtualizer({
      createElements: (count) => Array.from(Array(count)).map(() => document.createElement('div')),
      updateElement: (el, index) => {
        el.index = index;
        el.id = `item-${index}`;
        el.textContent = el.id;
        el.state = state;
      },
      scrollTarget,
      scrollContainer,
    });

    state = 0;
    virtualizer.size = 2;

    firstElement = elementsContainer.querySelector('#item-0');
    secondElement = elementsContainer.querySelector('#item-1');
  }

  beforeEach(() => init());

  it('should update the last element only', () => {
    state = 1;
    virtualizer.update(1);
    expect(firstElement.state).to.equal(0);
    expect(secondElement.state).to.equal(1);
  });

  it('should update the first element only', () => {
    state = 1;
    virtualizer.update(undefined, 0);
    expect(firstElement.state).to.equal(1);
    expect(secondElement.state).to.equal(0);
  });

  it('should update both elements', () => {
    state = 1;
    virtualizer.update();
    expect(firstElement.state).to.equal(1);
    expect(secondElement.state).to.equal(1);
  });

  it('should update neither of the elements', () => {
    state = 1;
    virtualizer.update(2, 10);
    expect(firstElement.state).to.equal(0);
    expect(secondElement.state).to.equal(0);
  });
});
