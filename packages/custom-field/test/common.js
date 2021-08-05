export const dispatchChange = function (el) {
  const evt = new CustomEvent('change', { bubbles: true });
  el.dispatchEvent(evt);
};
