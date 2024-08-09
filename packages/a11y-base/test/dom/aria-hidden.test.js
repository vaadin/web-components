import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { hideOthers, inertOthers } from '../../src/aria-hidden.js';

describe('aria-hidden', () => {
  let wrapper, parent, target1, target2;

  let teardown = [];

  beforeEach(async () => {
    wrapper = fixtureSync(`
      <div>
        <div id="parent">
          <div>hide me 1</div>
          <div id="target1">not me 2</div>
          <div>
            <div id="target2">not me 3</div>
          </div>
          <div id="outside1">hide me 4</div>
          <svg>
            <text>svg</text>
          </svg>
          <div id="hidden1" aria-hidden="true">I am already hidden! 5</div>
          <div id="hidden2" aria-hidden>I am hidden in a wrong way 6</div>
          <div aria-live="polite">not-hidden life</div>
          <div aria-live="off">hidden life</div>
        </div>
        <div>don't touch me 6</div>
      </div>
    `);
    parent = wrapper.children[0];
    target1 = wrapper.querySelector('#target1');
    target2 = wrapper.querySelector('#target2');
    await nextRender();
  });

  afterEach(() => {
    teardown.forEach((callback) => {
      callback();
    });

    teardown = [];
  });

  it('hide single target', async () => {
    const unhide = hideOthers(target1, parent);
    teardown.push(unhide);
    await expect(wrapper).dom.to.equalSnapshot();
  });

  it('hide multiple targets', async () => {
    const unhide = hideOthers([target1, target2], parent);
    teardown.push(unhide);
    await expect(wrapper).dom.to.equalSnapshot();
  });

  it('hide multiple calls', async () => {
    const unhide1 = hideOthers(target1, parent);
    const unhide2 = hideOthers(target2, parent);
    teardown.push(unhide1, unhide2);
    await expect(wrapper).dom.to.equalSnapshot();
  });

  it('inert single target', async () => {
    const unhide = inertOthers(target1, parent);
    teardown.push(unhide);
    await expect(wrapper).dom.to.equalSnapshot();
  });

  it('inert multiple targets', async () => {
    const unhide = inertOthers([target1, target2], parent);
    teardown.push(unhide);
    await expect(wrapper).dom.to.equalSnapshot();
  });

  it('inert multiple calls', async () => {
    const unhide1 = inertOthers(target1, parent);
    const unhide2 = inertOthers(target2, parent);
    teardown.push(unhide1, unhide2);
    await expect(wrapper).dom.to.equalSnapshot();
  });
});
