export function dispatchChange(el) {
  const evt = new CustomEvent('change', { bubbles: true });
  el.dispatchEvent(evt);
}
