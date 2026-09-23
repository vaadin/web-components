import { expect } from '@vaadin/chai-plugins';

export const BUTTON_WIDTH = 60;

export const createItems = (count) => [...new Array(count)].map((_, i) => ({ text: `Item ${i + 1}` }));

// Utility function to assert a menu item is not visible
export const assertHidden = (elem, label) => {
  const style = getComputedStyle(elem);
  expect(style.visibility, label).to.equal('hidden');
  expect(style.position, label).to.equal('absolute');
};

// Utility function to assert a menu item is visible
export const assertVisible = (elem, label) => {
  const style = getComputedStyle(elem);
  expect(style.visibility, label).to.equal('visible');
  expect(style.position, label).to.not.equal('absolute');
};

export const expectCollapsed = (menu, hiddenIndexes) => {
  const buttons = menu._buttons;
  const overflow = buttons.at(-1);
  buttons
    .slice(0, -1)
    .forEach((btn, i) => (hiddenIndexes.includes(i) ? assertHidden : assertVisible)(btn, `button ${i}`));
  expect(overflow.hasAttribute('hidden'), 'overflow button hidden').to.equal(hiddenIndexes.length === 0);
  expect(overflow.item.children, 'overflow items').to.deep.equal(hiddenIndexes.map((i) => menu.items[i]));
  expect(menu.hasAttribute('has-single-button'), 'has-single-button').to.equal(
    hiddenIndexes.length === buttons.length - 1,
  );
};

export const expectOverflowInside = (menu) => {
  const rect = menu._buttons.at(-1).getBoundingClientRect();
  const host = menu.getBoundingClientRect();
  expect(rect.left, 'overflow button start edge').to.be.at.least(host.left);
  expect(rect.right, 'overflow button end edge').to.be.at.most(host.right);
};
