import { keyDownOn, keyUpOn } from '@polymer/iron-test-helpers/mock-interactions.js';

/**
 * Helper which mimics the way how Polymer <test-fixture> works.
 * Use `document.importNode` to ensure proper upgrade timings.
 */
export const fixtureSync = (html) => {
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  const div = document.createElement('div');
  div.appendChild(document.importNode(tpl.content, true));
  const el = div.firstElementChild;
  document.body.appendChild(el);
  return el;
};

export const down = (node) => {
  node.dispatchEvent(new CustomEvent('down'));
};

export const up = (node) => {
  node.dispatchEvent(new CustomEvent('up'));
};

export const focusout = (node, composed = true) => {
  const event = new CustomEvent('focusout', { bubbles: true, composed });
  node.dispatchEvent(event);
};

export const focusin = (node) => {
  const event = new CustomEvent('focusin', { bubbles: true, composed: true });
  node.dispatchEvent(event);
};

export const arrowDown = (target) => {
  keyDownOn(target, 40);
  keyUpOn(target, 40);
};

export const arrowRight = (target) => {
  keyDownOn(target, 39);
  keyUpOn(target, 39);
};

export const arrowLeft = (target) => {
  keyDownOn(target, 37);
  keyUpOn(target, 37);
};

export const arrowUp = (target) => {
  keyDownOn(target, 38);
  keyUpOn(target, 38);
};

export const visible = (e) => {
  const rect = e.getBoundingClientRect();
  return !!(rect.width && rect.height);
};
