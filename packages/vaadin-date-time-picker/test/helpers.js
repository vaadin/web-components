export const dispatchChange = (elem) => elem.dispatchEvent(new CustomEvent('change', { bubbles: true }));

export const changeInputValue = (el, value) => {
  el.value = value;
  dispatchChange(el);
};

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
